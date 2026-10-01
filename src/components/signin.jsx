import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginSubmit, handleUsernameChange } from "../utils/handlers";
import {
  hidepasswordicon,
  passwordicon,
  showpasswordicon,
  usericon,
} from "../assets/svgs/icons";

export function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigatingToSignup, setIsNavigatingToSignup] = useState(false);
  const [isNavigatingToDashboard, setIsNavigatingToDashboard] = useState(false);
  const navigate = useNavigate();

  const navigateAfterLogin = (path, options) => {
    setIsNavigatingToDashboard(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 180;
    window.setTimeout(() => navigate(path, options), delay);
  };

  const handleSignupNavigation = (event) => {
    event.preventDefault();
    if (isNavigatingToSignup) return;

    setIsNavigatingToSignup(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 180;
    window.setTimeout(() => navigate("/signup"), delay);
  };

  return (
    <main
      className={`signin-page ${
        isNavigatingToSignup || isNavigatingToDashboard ? "is-leaving" : ""
      }`}
    >
      <h1 className="signin-title">ورود به حساب کاربری</h1>
      <form
        id="login-form"
        className="signin-form"
        onSubmit={(e) =>
          handleLoginSubmit(
            e,
            setError,
            setLoading,
            username,
            password,
            navigateAfterLogin,
          )
        }
      >
        <div className="signin-field">
          <input
            type="text"
            placeholder="نام کاربری"
            required
            onInvalid={(e) => e.target.setCustomValidity("نام کاربری الزامی است")}
            onInput={(e) => e.target.setCustomValidity("")}
            className="signin-input"
            title="فقط حروف انگلیسی، اعداد و _ مجاز است"
            value={username}
            onChange={(e) => handleUsernameChange(e, setUsername)}
          />
          {usericon}
        </div>

        <div className="signin-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور"
            required
            onInvalid={(e) => e.target.setCustomValidity("رمز عبور الزامی است")}
            onInput={(e) => e.target.setCustomValidity("")}
            className="signin-input"
            title="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordicon}
          <button
            className="signin-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? showpasswordicon : hidepasswordicon}
          </button>
        </div>

        <Link to="#" className="signin-forgot">
          رمز خود را فراموش کردید؟
        </Link>

        <div className="signin-captcha">
          <input
            type="checkbox"
            className="signin-checkbox"
            required
            onInvalid={(e) =>
              e.target.setCustomValidity("لطفا تایید کنید که ربات نیستید")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
          <p>ربات نیستم</p>
        </div>

        {/* نمایش متن ارور از سمت سرور */}
        {error !== "" && <p className="signin-error">{error}</p>}

        <button
          type="submit"
          className="signin-submit"
          disabled={loading || isNavigatingToDashboard}
        >
          {loading ? <Spinner /> : "ورود"}
        </button>
        <p className="signin-footer">
          اکانتی از قبل ندارید؟
          <Link
            className="signin-signup-link"
            to="/signup"
            onClick={handleSignupNavigation}
          >
            ثبت نام
          </Link>
        </p>
      </form>
    </main>
  );
}

export function Spinner() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 animate-spin"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </>
  );
}
