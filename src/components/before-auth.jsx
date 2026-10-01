import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleRoleSelection, handleRoleButtons } from "../utils/handlers";
import { roles } from "../utils/lists";
export function UserType() {
  const [role, setRole] = useState("انتخاب مهارت / تخصص");
  const [roleSelectionStatus, setRoleSelectionStatus] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const continueToSignin = () => {
    setIsNavigating(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 180;
    window.setTimeout(() => navigate("/signin"), delay);
  };

  return (
    <main className={`before-auth-page ${isNavigating ? "is-leaving" : ""}`}>
      <section className="before-auth-content">
      <h1 className="before-auth-title">
        به منظور ایجاد بهترین تجربه برای کاربران لطفا قبل از ورود نقش یا موقعیت
        شغلی خود را شرح دهید
      </h1>
      <button
        className="before-auth-select"
        onClick={() =>
          handleRoleSelection(roleSelectionStatus, setRoleSelectionStatus)
        }
      >
        {role}
        <span className="relative size-4 md:size-5 lg:size-6 xl:size-7 mt-1 mr-3 inline-block">
          {/* Arrow-down — visible when closed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`absolute inset-0 size-full transition-all duration-500 ease-in-out ${
              roleSelectionStatus
                ? "opacity-0 rotate-90 scale-75"
                : "opacity-100 rotate-0 scale-100"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>

          {/* X — visible when open */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`absolute inset-0 size-full transition-all duration-500 ease-in-out ${
              roleSelectionStatus
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </span>
      </button>

      <div className="before-auth-options">
        {roles.map((option, index) => (
          <button
            key={option}
            onClick={() =>
              handleRoleButtons(
                roleSelectionStatus,
                setRoleSelectionStatus,
                option,
                setRole,
              )
            }
            style={{
              transitionDelay: roleSelectionStatus ? `${index * 60}ms` : "0ms",
              display: !roleSelectionStatus ? "none" : "block",
            }}
            className={`before-auth-option ${
              index === roles.length - 1 ? "before-auth-option-other" : ""
            } ${option === role ? "is-selected" : ""} ${
              roleSelectionStatus ? "is-open" : "is-closed"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {role !== "انتخاب مهارت / تخصص" && (
        <h3 className="before-auth-confirmation">
          محتوا و چیدمان صفحه شخصی شما مناسب برای {role}{" "}
          {role === "سایر" && "مشاغل"} خواهد بود
        </h3>
      )}

      {role !== "انتخاب مهارت / تخصص" && (
        <button
          className="before-auth-next"
          onClick={continueToSignin}
          disabled={isNavigating}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 mt-1.5 ml-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          بعدی
        </button>
      )}
      </section>
    </main>
  );
}
