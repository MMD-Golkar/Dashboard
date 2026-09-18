import { useState } from "react";
import { Link } from "react-router-dom";
import { handleLoginSubmit, handleUsernameChange } from "../utils/handlers";

export function Signin(user, setUser) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate()

  return (
    <>
      <h1 className="text-2xl text-center mt-10 md:text-3xl lg:text-4xl">
        ورود به حساب کاربری
      </h1>
      <form
        id="login-form"
        className="border-1 w-110 md:w-150 flex flex-col p-2 mr-auto ml-auto mt-10 gap-3 rounded-lg relative"
        onSubmit={(e) =>
          handleLoginSubmit(
            e,
            user,
            setUser,
            error,
            setError,
            loading,
            setLoading,
            username,
            password,
          )
        }
      >
        <input
          type="text"
          placeholder="نام کاربری"
          required
          onInvalid={(e) => e.target.setCustomValidity("نام کاربری الزامی است")}
          onInput={(e) => e.target.setCustomValidity("")}
          className="border-1 rounded-lg p-2 pr-8 lg:pr-9 mt-4"
          title="فقط حروف انگلیسی، اعداد و _ مجاز است"
          value={username}
          onChange={(e) => handleUsernameChange(e, setUsername)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 md:size-6 xl:size-7 absolute mt-7 lg:mt-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="رمز عبور"
          required
          onInvalid={(e) => e.target.setCustomValidity("رمز عبور الزامی است")}
          onInput={(e) => e.target.setCustomValidity("")}
          className="border-1 rounded-lg p-2 pr-8 lg:pr-9"
          title="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 md:size-6 xl:size-7 absolute mt-20.5 lg:mt-20 xl:mt-19.5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>

        <Link to="#" className="text-blue-700 mr-3">
          رمز خود را فراموش کردید؟
        </Link>
        <div className="flex gap-2 items-center mr-3">
          <input
            type="checkbox"
            className="mt-1 size-4 cursor-pointer"
            required
            onInvalid={(e) =>
              e.target.setCustomValidity("لطفا تایید کنید که ربات نیستید")
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />
          <p>ربات نیستم</p>
        </div>
        <button
          className="absolute mt-20 left-6 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          )}
        </button>
        {/* نمایش متن ارور از سمت سرور */}
        {error !== "" && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="border-1 rounded-md w-70 flex items-center justify-center p-2 mr-auto ml-auto mt-5 cursor-pointer"
        >
          {loading ? <Spinner /> : "ورود"}
        </button>
        <p className="flex justify-center text-gray-700 mt-3 mb-4">
          اکانتی از قبل ندارید؟
          <Link className="mr-1 text-blue-700" to="/signup">
            ثبت نام
          </Link>
        </p>
      </form>
    </>
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
