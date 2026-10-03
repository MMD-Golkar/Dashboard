import { apiRequest } from "./api";
import { weekDays } from "./lists";


const formatLocalDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function handleRoleSelection(
  roleSelectionStatus,
  setRoleSelectionStatus,
) {
  setRoleSelectionStatus(!roleSelectionStatus);
}
export function handleRoleButtons(
  roleSelectionStatus,
  setRoleSelectionStatus,
  role,
  setRole,
) {
  setRoleSelectionStatus(false);
  setRole(role);
  localStorage.setItem("userRole", role);
}
export async function handleLoginSubmit(e, setError, setLoading, username, password, navigate) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      authenticated: false,
      body: {
        username,
        password,
        loginDate: formatLocalDateKey(new Date()),
      },
    });
    localStorage.setItem("token", data.token);
    if (data.user?.role) localStorage.setItem("userRole", data.user.role);
    navigate("/dashboard", { replace: true });
  } catch (error) {
    setError(error.message || "ارتباط با سرور برقرار نشد");
  } finally {
    setLoading(false);
  }
}

export function handleUsernameChange(e, setUsername) {
  const value = e.target.value;
  const filtered = value.replace(/[^a-zA-Z0-9_]/g, "");
  setUsername(filtered);
}

//************************************************Signup************************************************************
export const handleSignupSubmit = async (
  e,
  userSignupInfo,
  setError,
  setIsLoading,
  setUserSignupInfo,
  navigate,
) => {
  e.preventDefault();
  const validateSignup = (info) => {
    const errors = {};

    if (!info.name.trim()) errors.name = "وارد کردن نام اجباری است";
    if (!info.lastname.trim())
      errors.lastname = "وارد کردن نام خانوادگی اجباری است";

    if (!/^\S+@\S+\.\S+$/.test(info.email.trim()))
      errors.email = "لطفا ایمیل معتبر وارد کنید";

    if (info.phone && !/^\+?\d{10,15}$/.test(info.phone.replace(/\s/g, "")))
      errors.phone = "لطفا شماره معتبر وارد کنید";

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(info.username.trim()))
      errors.username = "بین 3 تا 20 کارکتر: حروف , شماره , _";

    if (info.password.length < 8)
      errors.password = "رمز عبور حداقل باید 8 کارکتر باشد";

    if (info.password !== info.repassword)
      errors.repassword = "رمز های عبور یکسان نیستند";

    if (!info.ruleschecked) errors.ruleschecked = "پذیرش قوانین الزامی است";

    return errors;
  };
  const validationErrors = validateSignup(userSignupInfo);
  setError(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  const payload = {
    name: userSignupInfo.name.replace(/\s/g, ""),
    lastName: userSignupInfo.lastname.replace(/\s/g, ""),
    email: userSignupInfo.email.replace(/\s/g, "").toLowerCase(),
    phone: userSignupInfo.phone.replace(/\s/g, ""),
    username: userSignupInfo.username.replace(/[^a-zA-Z0-9_]/g, ""),
    password: userSignupInfo.password,
    rulesCheck: userSignupInfo.ruleschecked,
    newsCheck: userSignupInfo.newschecked,
    role: localStorage.getItem("userRole") || "سایر",
  };
  setIsLoading(true);
  try {
    await apiRequest("/auth/signup", {
      method: "POST",
      authenticated: false,
      body: payload,
    });
    navigate("/signin", {
      replace: true,
      state: { message: "حساب کاربری ساخته شد! لطفا وارد شوید." },
    });
  } catch (err) {
    setError(
      err.errors ||
        (err.field
          ? { [err.field]: err.message }
          : { general: err.message || "ارتباط با سرور برقرار نشد. دوباره تلاش کنید." }),
    );
  } finally {
    setIsLoading(false);
  }
};

export function handleSignupName(e, userSignupInfo, setUserSignupInfo) {
  const name = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
  setUserSignupInfo({
    ...userSignupInfo,
    name: name,
  });
}
export function handleSignupLastname(e, userSignupInfo, setUserSignupInfo) {
  const Lastname = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
  setUserSignupInfo({
    ...userSignupInfo,
    lastname: Lastname,
  });
}

export function handleSignupEmail(e, userSignupInfo, setUserSignupInfo) {
  const email = e.target.value;
  setUserSignupInfo({
    ...userSignupInfo,
    email: email,
  });
}
export function handleSignupUsername(e, userSignupInfo, setUserSignupInfo) {
  const username = e.target.value;
  setUserSignupInfo({
    ...userSignupInfo,
    username: username,
  });
}
export function handleSignupPhone(e, userSignupInfo, setUserSignupInfo) {
  const phone = e.target.value;
  setUserSignupInfo({
    ...userSignupInfo,
    phone: phone,
  });
}

export function handleSignupPassword(e, userSignupInfo, setUserSignupInfo) {
  const password = e.target.value;
  setUserSignupInfo({
    ...userSignupInfo,
    password: password,
  });
}

// ****************************************************Dashboard****************************************************** //
export const formatDateInTimeZone = (date, timeZone) => {
  const options = {
    ...(timeZone ? { timeZone } : {}),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", options)
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const getPreviousDate = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

export const getWeekDateKeys = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const saturday = new Date(Date.UTC(year, month - 1, day));
  saturday.setUTCDate(saturday.getUTCDate() - ((saturday.getUTCDay() + 1) % 7));

  return weekDays.map((_, index) => {
    const weekDate = new Date(saturday);
    weekDate.setUTCDate(saturday.getUTCDate() + index);
    return weekDate.toISOString().slice(0, 10);
  });
};

export const getCurrentLoginStreak = (loginDays, today) => {
  const loggedInDates = new Set(loginDays);
  let currentDate = loggedInDates.has(today) ? today : getPreviousDate(today);
  let streak = 0;

  while (loggedInDates.has(currentDate)) {
    streak += 1;
    currentDate = getPreviousDate(currentDate);
  }

  return streak;
};

export const searchWeatherLocations = async (query, signal) => {
  const params = new URLSearchParams({
    name: query,
    count: "100",
    language: "fa",
    format: "json",
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal },
  );
  if (!response.ok) throw new Error("Location search failed");

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const fetchCurrentWeather = async (place) => {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
    timezone: "auto",
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
  );
  if (!response.ok) throw new Error("Weather request failed");

  const data = await response.json();
  if (!data.current) throw new Error("Weather data unavailable");

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
  };
};

export const getWeatherDescription = (code) => {
  if (code === 0) return "آسمان صاف";
  if (code === 1) return "عمدتاً صاف";
  if (code === 2) return "کمی ابری";
  if (code === 3) return "ابری";
  if (code === 45 || code === 48) return "مه‌آلود";
  if ([51, 53, 55, 56, 57].includes(code)) return "نم‌نم باران";
  if ([61, 63, 65, 66, 67].includes(code)) return "بارانی";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "برفی";
  if ([80, 81, 82].includes(code)) return "رگبار";
  if ([95, 96, 99].includes(code)) return "طوفانی";
  return "وضعیت نامشخص";
};

 