import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  handleSignupSubmit,
  handleSignupName,
  handleSignupLastname,
  handleSignupUsername,
  handleSignupEmail,
  handleSignupPhone,
  handleSignupPassword,
} from "../utils/handlers";
export function Signup() {
  const navigate = useNavigate();
  const [userSignupInfo, setUserSignupInfo] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    repassword: "",
    ruleschecked: false,
    newschecked: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  return (
    <main className="signup-page">
      <h1 className="signup-title">اکانت خود را ایجاد کنید</h1>
      {Object.keys(error).length > 0 && (
        <div className="signup-errors" role="alert">
          {Object.entries(error).map(([field, message]) => (
            <p className="signup-error" key={field}>
              {message}
            </p>
          ))}
        </div>
      )}
      <form
        className="signup-form"
        onSubmit={(e) =>
          handleSignupSubmit(
            e,
            userSignupInfo,
            setError,
            setIsLoading,
            setUserSignupInfo,
            navigate,
          )
        }
      >
        <div className="signup-name-row">
          <div className="signup-field">
            <input
              type="text"
              placeholder="نام"
              className="signup-input"
              title="نام خود را وارد کنید"
              value={userSignupInfo.name}
              onChange={(e) =>
                handleSignupName(e, userSignupInfo, setUserSignupInfo)
              }
              required
              onInvalid={(e) => {
                e.target.setCustomValidity("لطفا نام خود را وارد کنید");
              }}
              onInput={(e) => {
                e.target.setCustomValidity("");
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="signup-icon"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="signup-field">
            <input
              type="text"
              placeholder="نام خانوادگی"
              className="signup-input"
              title="نام خود را وارد کنید"
              onChange={(e) =>
                handleSignupLastname(e, userSignupInfo, setUserSignupInfo)
              }
              value={userSignupInfo.lastname}
              required
              onInvalid={(e) => {
                e.target.setCustomValidity(
                  "لطفا نام خانوادگی خود را وارد کنید",
                );
              }}
              onInput={(e) => {
                e.target.setCustomValidity("");
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="signup-icon"
            >
              <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
            </svg>
          </div>
        </div>
        <div className="signup-field">
          <input
            type="email"
            placeholder="ایمیل"
            className="signup-input"
            value={userSignupInfo.email}
            onChange={(e) =>
              handleSignupEmail(e, userSignupInfo, setUserSignupInfo)
            }
            title="آدرس ایمیل را وارد کنید"
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("وارد کردن آدرس ایمیل اجباری است");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="signup-icon"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </div>
        <div className="signup-field">
          <input
            type="tel"
            placeholder="شماره همراه(اختیاری)"
            className="signup-input"
            onChange={(e) =>
              handleSignupPhone(e, userSignupInfo, setUserSignupInfo)
            }
            value={userSignupInfo.phone}
            title="شماره همراه"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="signup-icon"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="signup-field signup-field-wide">
          <input
            type="text"
            placeholder="نام کاربری"
            className="signup-input"
            value={userSignupInfo.username}
            onChange={(e) =>
              handleSignupUsername(e, userSignupInfo, setUserSignupInfo)
            }
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("وارد کردن نام کاربری اجباری است");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="signup-icon"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="signup-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور"
            className="signup-input"
            onChange={(e) =>
              handleSignupPassword(e, userSignupInfo, setUserSignupInfo)
            }
            value={userSignupInfo.password}
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("وارد کردن رمز اجباری است");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="signup-icon"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
          <button
            className="signup-password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
              </svg>
            )}
          </button>
        </div>
        <div className="signup-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="تکرار رمز عبور"
            className="signup-input"
            onChange={(e) =>
              setUserSignupInfo((prev) => ({
                ...prev,
                repassword: e.target.value,
              }))
            }
            value={userSignupInfo.repassword}
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("لطفا رمز خود را مجدد تکرار کنید");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="signup-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <div className="signup-check-row">
          <input
            type="checkbox"
            id="rules"
            className="signup-checkbox"
            checked={userSignupInfo.ruleschecked}
            required
            onInvalid={(e) => {
              e.target.setCustomValidity("پر کردن فیلد اجباری است");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            onChange={(e) =>
              setUserSignupInfo((prev) => ({
                ...prev,
                ruleschecked: e.target.checked,
              }))
            }
          />
          <p>
            {/* remember to add a rules page after done with dashboard */}
            <Link className="text-blue-700" to="#">
              قوانین
            </Link>{" "}
            را مطالعه کردم و شرایط را میپذیرم
          </p>
        </div>
        <div className="signup-check-row">
          <input
            type="checkbox"
            id="news"
            className="signup-checkbox"
            checked={userSignupInfo.newschecked}
            onChange={(e) =>
              setUserSignupInfo((prev) => ({
                ...prev,
                newschecked: e.target.checked,
              }))
            }
          />
          <p>مایلم از اخبار جدید مطلع شوم</p>
        </div>
        <button type="submit" className="signup-submit" disabled={isLoading}>
          {isLoading ? "در حال ثبت نام..." : "ثبت نام"}
        </button>
      </form>
    </main>
  );
}
