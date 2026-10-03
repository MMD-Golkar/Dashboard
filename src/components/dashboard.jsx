import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import {
  widgetCategories,
  defaultWidgetOrder,
  weekDays,
  recommendedLocations,
  widgetOrderByRole,
} from "../utils/lists";

import {
  formatDateInTimeZone,
  getPreviousDate,
  getWeekDateKeys,
  getCurrentLoginStreak,
  searchWeatherLocations,
  fetchCurrentWeather,
  getWeatherDescription
} from "../utils/handlers";

function RemoveWidgetButton({ widgetLabel, onRemove }) {
  return (
    <button
      className="dashboard-card-remove"
      type="button"
      aria-label={`حذف ویجت ${widgetLabel}`}
      title={`حذف ویجت ${widgetLabel}`}
      onClick={onRemove}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6 6 12 12M18 6 6 18"
        />
      </svg>
    </button>
  );
}





export function Dashboard() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [todos, setTodos] = useState([]);
  const [loginDays, setLoginDays] = useState([]);
  const [todoDraft, setTodoDraft] = useState("");
  const [isTodoComposerOpen, setIsTodoComposerOpen] = useState(false);
  const [weatherSelection, setWeatherSelection] = useState(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isLocationSearchLoading, setIsLocationSearchLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [dashboardStatus, setDashboardStatus] = useState("loading");
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLoadAttempt, setDashboardLoadAttempt] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [visibleWidgets, setVisibleWidgets] = useState({
    tasks: true,
    notes: true,
    streak: true,
    weather: true,
    flashcard: true,
  });
  const [selectedRole, setSelectedRole] = useState("سایر");
  const widgetOrder = widgetOrderByRole[selectedRole] || defaultWidgetOrder;
  const completedTodoCount = todos.filter((todo) => todo.completed).length;
  const normalizedLocationQuery = locationQuery.trim().toLocaleLowerCase();
  const matchingRecommendedLocations = recommendedLocations.filter((place) =>
    [place.name, place.admin1, place.country, place.id].some((value) =>
      value.toLocaleLowerCase().includes(normalizedLocationQuery),
    ),
  );
  const today = new Date();
  const locationTimeZone = weatherSelection?.place?.timezone;
  const todayKey = formatDateInTimeZone(today, locationTimeZone);
  const weekDateKeys = getWeekDateKeys(todayKey);
  const streakDisplayDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    ...(locationTimeZone ? { timeZone: locationTimeZone } : {}),
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(today);
  const loggedInDates = new Set(loginDays);
  const loginStreak = getCurrentLoginStreak(loginDays, todayKey);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setDashboardStatus("loading");
      setDashboardError("");
      try {
        const response = await apiRequest("/dashboard");
        if (cancelled) return;

        const dashboard = response.dashboard;
        setNote(dashboard.note || "");
        setTodos(Array.isArray(dashboard.todos) ? dashboard.todos : []);
        setLoginDays(
          Array.isArray(dashboard.loginDays) ? dashboard.loginDays : [],
        );
        setWeatherSelection(dashboard.weatherSelection || null);
        setTheme(dashboard.theme === "dark" ? "dark" : "light");
        setVisibleWidgets({
          tasks: true,
          notes: true,
          streak: true,
          weather: true,
          ...dashboard.visibleWidgets,
        });
        setSelectedRole(response.user.role || "سایر");
        localStorage.setItem("userRole", response.user.role || "سایر");
        setDashboardStatus("ready");
      } catch (error) {
        if (cancelled) return;
        if (error.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
          return;
        }
        setDashboardError(error.message || "بارگذاری اطلاعات انجام نشد.");
        setDashboardStatus("error");
      }
    };

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [dashboardLoadAttempt, navigate]);

  useEffect(() => {
    if (dashboardStatus !== "ready") return undefined;

    const saveTimeout = window.setTimeout(() => {
      void apiRequest("/dashboard", {
        method: "PUT",
        body: { note, todos, weatherSelection, theme, visibleWidgets },
      })
        .then(() => {
          setDashboardError("");
        })
        .catch((error) => {
          if (error.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin", { replace: true });
            return;
          }
          setDashboardError(error.message || "ذخیره اطلاعات انجام نشد.");
        });
    }, 450);

    return () => window.clearTimeout(saveTimeout);
  }, [
    dashboardStatus,
    note,
    todos,
    weatherSelection,
    theme,
    visibleWidgets,
    navigate,
  ]);

  useEffect(() => {
    const query = locationQuery.trim();
    if (query.length < 2) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await searchWeatherLocations(query, controller.signal);
        setLocationResults(results);
        setLocationError(results.length ? "" : "مکانی با این نام پیدا نشد.");
      } catch (error) {
        if (error.name !== "AbortError") {
          setLocationError("جستجوی مکان انجام نشد. دوباره تلاش کنید.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLocationSearchLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [locationQuery]);

  const toggleWidget = (widgetId) => {
    setVisibleWidgets((currentWidgets) => ({
      ...currentWidgets,
      [widgetId]: !currentWidgets[widgetId],
    }));
  };

  const addTodo = (event) => {
    event.preventDefault();
    const text = todoDraft.trim();
    if (!text) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: `${Date.now()}-${Math.random()}`, text, completed: false },
    ]);
    setTodoDraft("");
    setIsTodoComposerOpen(false);
  };

  const toggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const removeTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );
  };

  const updateLocationQuery = (event) => {
    const query = event.target.value;
    setLocationQuery(query);
    setLocationResults([]);
    setLocationError("");
    setIsLocationSearchLoading(query.trim().length >= 2);
  };

  const selectWeatherLocation = async (place) => {
    setIsWeatherLoading(true);
    setLocationError("");
    try {
      const selection = {
        place,
        weather: await fetchCurrentWeather(place),
      };
      setWeatherSelection(selection);
      setIsLocationPickerOpen(false);
      setLocationQuery("");
      setLocationResults([]);
    } catch {
      setLocationError("دریافت وضعیت آب‌وهوا ممکن نشد. دوباره تلاش کنید.");
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const selectTheme = (nextTheme) => {
    setTheme(nextTheme);
  };
  
  if (dashboardStatus !== "ready") {
    return (
      <main
        className="dashboard-page dashboard-loading-page"
        data-theme={theme}
      >
        <section className="dashboard-loading-panel" aria-live="polite">
          <p role={dashboardStatus === "loading" ? "status" : "alert"}>
            {dashboardStatus === "loading"
              ? "در حال بارگذاری داشبورد..."
              : dashboardError}
          </p>
          {dashboardStatus === "error" && (
            <button
              className="dashboard-location-button"
              type="button"
              onClick={() => setDashboardLoadAttempt((attempt) => attempt + 1)}
            >
              تلاش دوباره
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main
      className={`dashboard-page ${isMenuOpen ? "has-open-menu" : ""}`}
      data-theme={theme}
    >
      <header className="dashboard-header">
        <button
          className="dashboard-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "بستن فهرست" : "باز کردن فهرست"}
          aria-expanded={isMenuOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 6 12 12M18 6 6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <div className="dashboard-logo-wrap">
          <img
            src="../src/assets/images/dashboard-logo.svg"
            alt="Logo"
            className="dashboard-logo"
          />
        </div>
        <p className="dashboard-brand-title">داشبورد</p>
      </header>

      <div
        className={`dashboard-layout ${isSidebarCollapsed ? "is-sidebar-collapsed" : ""}`}
      >
        <aside
          className={`dashboard-sidebar ${isMenuOpen ? "is-open" : ""}`}
          id="dashboard-navigation"
        >
          <div className="dashboard-sidebar-heading">
            <button
              className="dashboard-sidebar-disclosure"
              type="button"
              aria-expanded={isCategoriesOpen}
              aria-controls="dashboard-widget-categories"
              onClick={() => setIsCategoriesOpen((open) => !open)}
            >
              <span>بخش‌های داشبورد</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={isCategoriesOpen ? "is-expanded" : ""}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>
            <button
              className="dashboard-sidebar-desktop-toggle"
              type="button"
              aria-label={
                isSidebarCollapsed ? "باز کردن نوار کناری" : "بستن نوار کناری"
              }
              aria-expanded={!isSidebarCollapsed}
              aria-controls="dashboard-navigation"
              onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                {isSidebarCollapsed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 18 6-6-6-6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15 18-6-6 6-6"
                  />
                )}
              </svg>
            </button>
            <button
              className="dashboard-sidebar-close"
              type="button"
              aria-label="بستن فهرست"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 6 12 12M18 6 6 18"
                />
              </svg>
            </button>
          </div>
          <nav
            aria-label="دسته‌بندی ویجت‌ها"
            className="dashboard-widget-nav"
            id="dashboard-widget-categories"
            hidden={!isCategoriesOpen}
          >
            {widgetCategories.map((widget) => (
              <label className="dashboard-widget-toggle" key={widget.id}>
                <input
                  type="checkbox"
                  checked={visibleWidgets[widget.id]}
                  onChange={() => toggleWidget(widget.id)}
                />
                <span
                  className={`dashboard-widget-marker dashboard-widget-marker-${widget.id}`}
                  aria-hidden="true"
                />
                <span>{widget.label}</span>
              </label>
            ))}
          </nav>
          <section className="dashboard-sidebar-settings">
            <button
              className="dashboard-sidebar-disclosure"
              type="button"
              aria-expanded={isSettingsOpen}
              aria-controls="dashboard-theme-settings"
              onClick={() => setIsSettingsOpen((open) => !open)}
            >
              <span>تنظیمات</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={isSettingsOpen ? "is-expanded" : ""}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>
            <div
              className="dashboard-theme-settings"
              id="dashboard-theme-settings"
              hidden={!isSettingsOpen}
            >
              <p className="dashboard-setting-label">حالت نمایش</p>
              <div
                className="dashboard-theme-control"
                role="group"
                aria-label="حالت نمایش"
              >
                <button
                  className={`dashboard-theme-option ${theme === "light" ? "is-selected" : ""}`}
                  type="button"
                  aria-pressed={theme === "light"}
                  onClick={() => selectTheme("light")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path
                      strokeLinecap="round"
                      d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                    />
                  </svg>
                  روشن
                </button>
                <button
                  className={`dashboard-theme-option ${theme === "dark" ? "is-selected" : ""}`}
                  type="button"
                  aria-pressed={theme === "dark"}
                  onClick={() => selectTheme("dark")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"
                    />
                  </svg>
                  تاریک
                </button>
              </div>
            </div>
          </section>
        </aside>
        {isSidebarCollapsed && (
          <button
            className="dashboard-sidebar-reopen"
            type="button"
            aria-label="باز کردن نوار کناری"
            aria-expanded="false"
            aria-controls="dashboard-navigation"
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 18 6-6-6-6"
              />
            </svg>
          </button>
        )}
        <button
          className={`dashboard-menu-backdrop ${isMenuOpen ? "is-visible" : ""}`}
          type="button"
          aria-label="بستن فهرست"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={() => setIsMenuOpen(false)}
        />

        <section className="dashboard-content">
          <div className="dashboard-intro">
            <p className="dashboard-dayline">مرور روزانه , place for weekday</p>
            <h1 className="dashboard-title">روزت رو هیجان انگیز کن🎉</h1>
            <p className="dashboard-subtitle">
              پیشرفت کوچک و مداوم چیزی فوق العاده پدید میاره
            </p>
          </div>

          {dashboardError && (
            <p className="dashboard-save-error" role="alert">
              {dashboardError}
            </p>
          )}

          <div className="dashboard-grid">
            {visibleWidgets.tasks && (
              <div
                className="dashboard-card dashboard-card-tasks"
                style={{ order: widgetOrder.indexOf("tasks") }}
              >
                <div className="dashboard-card-header">
                  <p className="dashboard-card-label">01 / فعالیت ها</p>
                  <div className="dashboard-card-tools">
                    <p className="dashboard-card-stat">
                      {completedTodoCount}/{todos.length}
                    </p>
                    <RemoveWidgetButton
                      widgetLabel="فعالیت ها"
                      onRemove={() => toggleWidget("tasks")}
                    />
                  </div>
                </div>

                <h2 className="dashboard-card-title">مأموریت </h2>

                {todos.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <p>هیچ مأموریتی ندارید</p>
                    <p className="dashboard-supporting-copy">
                      یک مأموریت اضافه کنید برای برنامه ریزی بعدی
                    </p>
                  </div>
                ) : (
                  <ul className="dashboard-todo-list">
                    {todos.map((todo) => (
                      <li
                        className={`dashboard-todo-item ${todo.completed ? "is-complete" : ""}`}
                        key={todo.id}
                      >
                        <label className="dashboard-todo-label">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                          />
                          <span>{todo.text}</span>
                        </label>
                        <button
                          className="dashboard-todo-remove"
                          type="button"
                          aria-label={`حذف فعالیت ${todo.text}`}
                          title={`حذف فعالیت ${todo.text}`}
                          onClick={() => removeTodo(todo.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 7h16m-10 4v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {isTodoComposerOpen && (
                  <form className="dashboard-todo-form" onSubmit={addTodo}>
                    <input
                      className="dashboard-todo-input"
                      type="text"
                      value={todoDraft}
                      onChange={(event) => setTodoDraft(event.target.value)}
                      placeholder="عنوان فعالیت را وارد کنید"
                      aria-label="عنوان فعالیت را وارد کنید"
                      required
                      autoFocus
                    />
                    <button className="dashboard-todo-submit" type="submit">
                      افزودن
                    </button>
                  </form>
                )}

                <button
                  className="dashboard-action"
                  type="button"
                  aria-expanded={isTodoComposerOpen}
                  onClick={() => setIsTodoComposerOpen((open) => !open)}
                >
                  + اضافه کردن
                </button>
              </div>
            )}

            {visibleWidgets.notes && (
              <div
                className="dashboard-card dashboard-card-notes"
                style={{ order: widgetOrder.indexOf("notes") }}
              >
                <div className="dashboard-card-header">
                  <p className="dashboard-card-label">02 / نوشته ها</p>
                  <div className="dashboard-card-tools">
                    <p className="dashboard-card-mark">🖊</p>
                    <RemoveWidgetButton
                      widgetLabel="نوشته ها"
                      onRemove={() => toggleWidget("notes")}
                    />
                  </div>
                </div>

                <h2 className="dashboard-card-title">یادداشت </h2>
                <textarea
                  rows={4}
                  placeholder="یادداشت خود را وارد کنید..."
                  className="dashboard-note-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <p className="dashboard-note-count">کارکتر ها: {note.length}</p>
              </div>
            )}

            {visibleWidgets.streak && (
              <div
                className="dashboard-card dashboard-card-streak"
                style={{ order: widgetOrder.indexOf("streak") }}
              >
                <div className="dashboard-card-header">
                  <p className="dashboard-card-label">03 / تداوم</p>
                  <div className="dashboard-card-tools">
                    <p className="dashboard-card-mark">↗</p>
                    <RemoveWidgetButton
                      widgetLabel="تداوم"
                      onRemove={() => toggleWidget("streak")}
                    />
                  </div>
                </div>

                <h2 className="dashboard-card-title">عادت ها </h2>
                <p className="dashboard-streak-date">{streakDisplayDate}</p>
                <p className="dashboard-streak-count"> روزها : {loginStreak}</p>

                <div
                  className="dashboard-login-week"
                  role="list"
                  aria-label="روزهای ورود این هفته"
                >
                  {weekDays.map((weekDay, index) => {
                    const dateKey = weekDateKeys[index];
                    const hasLoggedIn = loggedInDates.has(dateKey);

                    return (
                      <div
                        className={`dashboard-login-day ${hasLoggedIn ? "is-logged-in" : ""}`}
                        key={dateKey}
                        role="listitem"
                        aria-label={`${weekDay.label}: ${hasLoggedIn ? "ورود ثبت شد" : "بدون ورود"}`}
                        title={weekDay.label}
                      >
                        <span
                          className="dashboard-login-circle"
                          aria-hidden="true"
                        >
                          {weekDay.short}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="dashboard-streak-label">ورود متوالی روزانه</p>
                <p className="dashboard-supporting-copy">
                  همینطور پرقدرت ادامه بده
                </p>
                {/* remember to add a weekday login check here */}
              </div>
            )}

            {visibleWidgets.weather && (
              <div
                className="dashboard-card dashboard-card-weather"
                style={{ order: widgetOrder.indexOf("weather") }}
              >
                <div className="dashboard-card-header">
                  <p className="dashboard-card-label">04 / محیط</p>
                  <div className="dashboard-card-tools">
                    <p className="dashboard-card-mark">☀</p>
                    <RemoveWidgetButton
                      widgetLabel="محیط"
                      onRemove={() => toggleWidget("weather")}
                    />
                  </div>
                </div>

                <h2 className="dashboard-card-title">آب و هوا</h2>

                <button
                  className="dashboard-location-button"
                  type="button"
                  aria-expanded={isLocationPickerOpen}
                  onClick={() => {
                    setIsLocationPickerOpen((open) => !open);
                    setLocationError("");
                  }}
                >
                  {weatherSelection ? "تغییر مکان" : "مکانی را انتخاب کنید"}
                </button>

                {isLocationPickerOpen && (
                  <div className="dashboard-location-picker">
                    <div className="dashboard-location-search">
                      <input
                        className="dashboard-location-query"
                        type="search"
                        value={locationQuery}
                        onChange={updateLocationQuery}
                        placeholder="نام شهر یا کشور"
                        aria-label="نام شهر یا کشور"
                      />
                      <span
                        className="dashboard-location-search-icon"
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <circle cx="10.8" cy="10.8" r="6.8" />
                          <path strokeLinecap="round" d="m16 16 4.5 4.5" />
                        </svg>
                      </span>
                    </div>
                    {!normalizedLocationQuery &&
                      matchingRecommendedLocations.length > 0 && (
                        <section
                          className="dashboard-location-recommendations"
                          aria-label="مکان‌های پیشنهادی"
                        >
                          <p>مکان‌های پیشنهادی</p>
                          <div>
                            {matchingRecommendedLocations.map((place) => (
                              <button
                                className="dashboard-location-recommendation"
                                key={place.id}
                                type="button"
                                aria-pressed={
                                  weatherSelection?.place?.id === place.id
                                }
                                disabled={
                                  isWeatherLoading || isLocationSearchLoading
                                }
                                onClick={() => selectWeatherLocation(place)}
                              >
                                {place.name}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}
                    {isLocationSearchLoading && (
                      <p className="dashboard-location-status" role="status">
                        در حال جستجو...
                      </p>
                    )}
                    {normalizedLocationQuery.length === 1 && (
                      <p className="dashboard-location-status" role="status">
                        برای جستجو حداقل دو حرف وارد کنید.
                      </p>
                    )}
                    {locationError && (
                      <p className="dashboard-location-error" role="alert">
                        {locationError}
                      </p>
                    )}
                    {locationResults.length > 0 && (
                      <>
                        <p className="dashboard-location-results-count">
                          {locationResults.length} مکان پیدا شد
                        </p>
                        <ul className="dashboard-location-results">
                          {locationResults.map((place) => (
                            <li
                              key={`${place.id}-${place.latitude}-${place.longitude}`}
                            >
                              <button
                                className="dashboard-location-result"
                                type="button"
                                disabled={isWeatherLoading}
                                onClick={() => selectWeatherLocation(place)}
                              >
                                <span>{place.name}</span>
                                <small>
                                  {[place.admin1, place.country]
                                    .filter(Boolean)
                                    .join("، ")}
                                </small>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {isWeatherLoading && (
                  <p className="dashboard-location-status" role="status">
                    در حال دریافت وضعیت هوا...
                  </p>
                )}

                {weatherSelection ? (
                  <>
                    <div className="dashboard-weather-summary">
                      <p className="dashboard-weather-temperature">
                        {Math.round(weatherSelection.weather.temperature)}
                        <span>°C</span>
                      </p>
                      <p className="dashboard-weather-condition">
                        {getWeatherDescription(
                          weatherSelection.weather.weatherCode,
                        )}
                      </p>
                    </div>
                    <div className="dashboard-weather-details">
                      <p>
                        <span>مکان</span>
                        <strong>
                          {weatherSelection.place.name}
                          {weatherSelection.place.admin1
                            ? `، ${weatherSelection.place.admin1}`
                            : ""}
                        </strong>
                      </p>
                      <p>
                        <span>کشور</span>
                        <strong>{weatherSelection.place.country}</strong>
                      </p>
                      <p>
                        <span>حس‌شده</span>
                        <strong>
                          {Math.round(weatherSelection.weather.feelsLike)}°C
                        </strong>
                      </p>
                      <p>
                        <span>رطوبت</span>
                        <strong>{weatherSelection.weather.humidity}%</strong>
                      </p>
                      <p>
                        <span>سرعت باد</span>
                        <strong>
                          {Math.round(weatherSelection.weather.windSpeed)} km/h
                        </strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="dashboard-weather-empty">
                    برای نمایش وضعیت هوا یک مکان انتخاب کنید.
                  </p>
                )}
              </div>
            )}

            {visibleWidgets.flashcard && (
              <div
                className="dashboard-card dashboard-card-notes"
                style={{ order: widgetOrder.indexOf("flashcard") }}
              >
                <div className="dashboard-card-header">
                  <p className="dashboard-card-label">05 / کارت مرور</p>
                  <div className="dashboard-card-tools">
                    <p className="dashboard-card-mark">{widgetCategories[4].image}</p>
                    <RemoveWidgetButton
                      widgetLabel="کارت مرور"
                      onRemove={() => toggleWidget("flashcard")}
                    />
                  </div>
                </div>
                
                <div className="flashcards-container">
                    <input type="text" placeholder="کارت جدید اضافه کنید..." className="p-3"/>
                </div>

              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
