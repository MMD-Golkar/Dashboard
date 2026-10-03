import "dotenv/config";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import Database from "better-sqlite3";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const databaseDirectory = path.join(serverDirectory, "data");
fs.mkdirSync(databaseDirectory, { recursive: true });

const databasePath = process.env.DATABASE_PATH || path.join(databaseDirectory, "dashboard.sqlite");
const database = new Database(databasePath);
const jwtSecret = process.env.JWT_SECRET || "local-development-secret-change-before-deploying";
const port = Number(process.env.API_PORT || 5000);

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    phone TEXT NOT NULL DEFAULT '',
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'سایر',
    rules_check INTEGER NOT NULL DEFAULT 0,
    news_check INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dashboard_state (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    note TEXT NOT NULL DEFAULT '',
    todos_json TEXT NOT NULL DEFAULT '[]',
    flashcards_json TEXT NOT NULL DEFAULT '[]',
    login_days_json TEXT NOT NULL DEFAULT '[]',
    weather_selection_json TEXT,
    theme TEXT NOT NULL DEFAULT 'light',
    visible_widgets_json TEXT NOT NULL DEFAULT '{"tasks":true,"notes":true,"streak":true,"weather":true,"flashcard":true}',
    updated_at TEXT NOT NULL
  );
`);

const dashboardColumns = database.pragma("table_info(dashboard_state)");
if (!dashboardColumns.some((column) => column.name === "flashcards_json")) {
  database.exec("ALTER TABLE dashboard_state ADD COLUMN flashcards_json TEXT NOT NULL DEFAULT '[]'");
}

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "256kb" }));

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const jsonOr = (value, fallback) => {
  try {
    return value === null || value === undefined ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  lastName: user.last_name,
  email: user.email,
  phone: user.phone,
  username: user.username,
  role: user.role,
  newsCheck: Boolean(user.news_check),
});

const dashboardDefaults = {
  note: "",
  todos: [],
  flashcards: [],
  loginDays: [],
  weatherSelection: null,
  theme: "light",
  visibleWidgets: {
    tasks: true,
    notes: true,
    streak: true,
    weather: true,
    flashcard: true,
    focusTimer: true,
  },
};

const readDashboardState = (userId) => {
  const state = database
    .prepare("SELECT * FROM dashboard_state WHERE user_id = ?")
    .get(userId);
  if (!state) return dashboardDefaults;

  return {
    note: state.note,
    todos: jsonOr(state.todos_json, []),
    flashcards: jsonOr(state.flashcards_json, []),
    loginDays: jsonOr(state.login_days_json, []),
    weatherSelection: jsonOr(state.weather_selection_json, null),
    theme: state.theme,
    visibleWidgets: {
      ...dashboardDefaults.visibleWidgets,
      ...jsonOr(state.visible_widgets_json, {}),
    },
  };
};

const isDateKey = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const authenticate = (request, response, next) => {
  const authorization = request.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ message: "برای ادامه وارد حساب شوید." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    request.userId = payload.sub;
    next();
  } catch {
    response.status(401).json({ message: "نشست شما منقضی شده است. دوباره وارد شوید." });
  }
};

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/auth/signup", authRateLimit, async (request, response, next) => {
  const body = request.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const errors = {};

  if (!name) errors.name = "وارد کردن نام اجباری است";
  if (!lastName) errors.lastname = "وارد کردن نام خانوادگی اجباری است";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "لطفا ایمیل معتبر وارد کنید";
  if (phone && !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) {
    errors.phone = "لطفا شماره معتبر وارد کنید";
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    errors.username = "نام کاربری باید بین 3 تا 20 حرف، عدد یا _ باشد";
  }
  if (password.length < 8) errors.password = "رمز عبور حداقل باید 8 کارکتر باشد";
  if (body.rulesCheck !== true) errors.ruleschecked = "پذیرش قوانین الزامی است";

  if (Object.keys(errors).length) {
    return response.status(400).json({ message: "اطلاعات واردشده را بررسی کنید.", errors });
  }

  const usernameExists = database
    .prepare("SELECT 1 FROM users WHERE username = ? COLLATE NOCASE")
    .get(username);
  const emailExists = database
    .prepare("SELECT 1 FROM users WHERE email = ? COLLATE NOCASE")
    .get(email);
  if (usernameExists || emailExists) {
    const duplicateErrors = {};
    if (usernameExists) duplicateErrors.username = "این نام کاربری قبلا ثبت شده است.";
    if (emailExists) duplicateErrors.email = "این ایمیل قبلا ثبت شده است.";
    return response.status(409).json({
      message: "این حساب قبلا ثبت شده است.",
      errors: duplicateErrors,
    });
  }

  try {
    const user = {
      id: randomUUID(),
      name,
      lastName,
      email,
      phone,
      username,
      passwordHash: await bcrypt.hash(password, 12),
      role: typeof body.role === "string" && body.role.length <= 100 ? body.role : "سایر",
      rulesCheck: 1,
      newsCheck: body.newsCheck === true ? 1 : 0,
      createdAt: new Date().toISOString(),
    };

    database.transaction(() => {
      database.prepare(`
        INSERT INTO users
          (id, name, last_name, email, phone, username, password_hash, role, rules_check, news_check, created_at)
        VALUES
          (@id, @name, @lastName, @email, @phone, @username, @passwordHash, @role, @rulesCheck, @newsCheck, @createdAt)
      `).run(user);
      database.prepare(`
        INSERT INTO dashboard_state (user_id, updated_at) VALUES (?, ?)
      `).run(user.id, user.createdAt);
    })();

    response.status(201).json({ user: publicUser({
      id: user.id,
      name: user.name,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      news_check: user.newsCheck,
    }) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", authRateLimit, async (request, response, next) => {
  const username = typeof request.body?.username === "string" ? request.body.username.trim() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!username || !password) {
    return response.status(400).json({ message: "نام کاربری و رمز عبور الزامی است." });
  }

  try {
    const user = database.prepare(`
      SELECT * FROM users
      WHERE username = ? COLLATE NOCASE OR email = ? COLLATE NOCASE
    `).get(username, username);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
    }

    const requestedDate = request.body?.loginDate;
    const loginDate = isDateKey(requestedDate)
      ? requestedDate
      : new Date().toISOString().slice(0, 10);
    const state = database.prepare(
      "SELECT login_days_json FROM dashboard_state WHERE user_id = ?",
    ).get(user.id);
    const loginDays = jsonOr(state?.login_days_json, []);
    if (!loginDays.includes(loginDate)) {
      loginDays.push(loginDate);
      loginDays.sort();
      database.prepare(`
        UPDATE dashboard_state SET login_days_json = ?, updated_at = ? WHERE user_id = ?
      `).run(JSON.stringify(loginDays), new Date().toISOString(), user.id);
    }

    const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "7d" });
    response.json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", authenticate, (request, response) => {
  const user = database.prepare("SELECT * FROM users WHERE id = ?").get(request.userId);
  if (!user) return response.status(401).json({ message: "حساب کاربری پیدا نشد." });
  response.json({ user: publicUser(user), dashboard: readDashboardState(user.id) });
});

app.put("/api/dashboard", authenticate, (request, response) => {
  const body = request.body || {};
  const note = typeof body.note === "string" ? body.note : "";
  const todos = Array.isArray(body.todos) ? body.todos : null;
  const flashcards = body.flashcards === undefined
    ? []
    : Array.isArray(body.flashcards)
      ? body.flashcards
      : null;
  const allowedWidgets = ["tasks", "notes", "streak", "weather", "flashcard", "focusTimer"];
  const theme = body.theme;

  if (note.length > 50000) {
    return response.status(400).json({ message: "یادداشت بیش از حد طولانی است." });
  }
  if (!todos || todos.length > 500 || todos.some((todo) =>
    !todo || typeof todo.id !== "string" || typeof todo.text !== "string" ||
    todo.text.trim().length === 0 || todo.text.length > 500 || typeof todo.completed !== "boolean",
  )) {
    return response.status(400).json({ message: "فهرست فعالیت‌ها معتبر نیست." });
  }
  if (!flashcards || flashcards.length > 100 || flashcards.some((flashcard) =>
    !flashcard || typeof flashcard.id !== "string" || flashcard.id.length === 0 ||
    flashcard.id.length > 100 || typeof flashcard.question !== "string" ||
    flashcard.question.trim().length === 0 || flashcard.question.length > 1000 ||
    typeof flashcard.answer !== "string" || flashcard.answer.trim().length === 0 ||
    flashcard.answer.length > 1000,
  )) {
    return response.status(400).json({ message: "فهرست کارت‌های مرور معتبر نیست." });
  }
  if (theme !== "light" && theme !== "dark") {
    return response.status(400).json({ message: "حالت نمایش معتبر نیست." });
  }
  if (!body.visibleWidgets || allowedWidgets.some((widget) =>
    typeof body.visibleWidgets[widget] !== "boolean",
  )) {
    return response.status(400).json({ message: "نمایش ویجت‌ها معتبر نیست." });
  }
  if (body.weatherSelection !== null && (
    !body.weatherSelection || typeof body.weatherSelection !== "object" ||
    !body.weatherSelection.place || !body.weatherSelection.weather
  )) {
    return response.status(400).json({ message: "مکان انتخاب‌شده معتبر نیست." });
  }

  const updatedAt = new Date().toISOString();
  database.prepare(`
    UPDATE dashboard_state
    SET note = ?, todos_json = ?, flashcards_json = ?, weather_selection_json = ?, theme = ?,
        visible_widgets_json = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    note,
    JSON.stringify(todos),
    JSON.stringify(flashcards),
    body.weatherSelection === null ? null : JSON.stringify(body.weatherSelection),
    theme,
    JSON.stringify(Object.fromEntries(allowedWidgets.map((id) => [id, body.visibleWidgets[id]]))),
    updatedAt,
    request.userId,
  );

  response.json({ saved: true, updatedAt });
});

app.use((request, response) => {
  response.status(404).json({ message: "مسیر درخواستی پیدا نشد." });
});

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  console.error("API error:", error.message);
  response.status(500).json({ message: "خطای داخلی سرور." });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Dashboard API listening on http://127.0.0.1:${port}`);
});