import "../styles/before-auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleRoleSelection, handleRoleButtons } from "../utils/handlers";
import { roles } from "../utils/lists";
export function UserType() {
  const [role, setRole] = useState("انتخاب مهارت / تخصص");
  const [roleSelectionStatus, setRoleSelectionStatus] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <h1 className="flex justify-center mt-30 sm:text-2xl lg:text-3xl text-center">
        به منظور ایجاد بهترین تجربه برای کاربران لطفا قبل از ورود نقش یا موقعیت
        شغلی خود را شرح دهید
      </h1>
      <button
        className="border-1 pl-5 pr-5 pt-3 pb-3 rounded-lg text-sm sm:text-sm relative md:text-md lg:text-lg xl:text-xl mr-auto ml-auto flex mt-24 cursor-pointer items-center"
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

      <div className="grid grid-cols-2 gap-3 mt-5 max-w-md ml-auto mr-auto [&>button]:border-1 md:[&>button]:pt-4 md:[&>button]:pb-4 md:[&>button]:pr-7 md:[&>button]:pl-7 [&>button]:rounded-md [&>button]:p-2 [&>button]:hover:bg-blue-400 [&>button]:cursor-pointer">
        {roles.map((role, index) => (
          <button
            key={role}
            onClick={() =>
              handleRoleButtons(
                roleSelectionStatus,
                setRoleSelectionStatus,
                role,
                setRole,
              )
            }
            style={{
              transitionDelay: roleSelectionStatus ? `${index * 60}ms` : "0ms",
              display: !roleSelectionStatus ? "none" : "inline",
            }}
            className={`border rounded-xl p-3 text-sm sm:text-base cursor-pointer transition-all duration-300 ease-out active:scale-95 ${
              index === roles.length - 1
                ? "col-span-2 justify-self-center w-1/2"
                : ""
            } ${
              roleSelectionStatus
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            } ${
              role === role
                ? "border-blue-500 bg-blue-500 text-white shadow-md"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {role !== "انتخاب مهارت / تخصص" && (
        <h3 className="mt-20 text-center sm:text-2xl lg:text-3xl">
          محتوا و چیدمان صفحه شخصی شما مناسب برای {role}{" "}
          {role === "سایر" && "مشاغل"} خواهد بود
        </h3>
      )}

      {role !== "انتخاب مهارت / تخصص" && (
        <button
          className="border-1 pt-4 pb-4 pl-15 pr-15 rounded-full flex mr-auto ml-auto mt-10 cursor-pointer hover:bg-blue-500 hover:text-white md:pt-6 md:pb-6 md:pl-20 md:pr-20"
          onClick={() => navigate("/signin")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4 mt-1.5 ml-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          بعدی
        </button>
      )}
    </>
  );
}
