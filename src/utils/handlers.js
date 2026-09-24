import { mockSignup } from "./mockSignup";
import { mockLogin } from "./mockLogin";

const USE_MOCK = true;
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
    const response = USE_MOCK
      ? await mockLogin({ username, password })
      : await fetch(/* ... */);

    let data = {};
    try {
      data = await response.json();
    } catch {
      /* keep data as {} */
    }

    if (!response.ok) {
      setError(data.message || "خطای دریافت اطلاعات");
      return;
    }

    localStorage.setItem("token", data.token);
    navigate("/dashboard", { replace: true });
  } catch (err) {
    console.log("caught error:", err);
    setError("ارتباط با سرور برقرار نشد");
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
  };
  setIsLoading(true);
  try {
    const res = USE_MOCK
      ? await mockSignup(payload)
      : await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    let data = {};
    try {
      data = await res.json();
    } catch {
      /* keep data as {} */
    }

    if (res.ok) {
      navigate("/signin", {
        replace: true,
        state: { message: "حساب کاربری ساخته شد! لطفا وارد شوید." },
      });
    } else if (data.field) {
      setError({ [data.field]: data.message });
    } else if (data.errors) {
      setError(data.errors);
    } else {
      setError({ general: data.message || "مشکلی پیش آمد. دوباره تلاش کنید." });
    }
  } catch (err) {
    setError({
      general: "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.",
    });
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
