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
export async function handleLoginSubmit(
  e,
  user,
  setUser,
  error,
  setError,
  loading,
  setLoading,
  username,
  password,
) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "خطای دریافت اطلاعات");
      return;
    }
    console.log(username , password)
    localStorage.setItem("token", data.token);
    // navigate to dashboard here
  } catch (err) {
    // network problem, server down, etc.
    setError(err);
  } finally {
    setLoading(false);
  }
}

export function handleUsernameChange(e, setUsername) {
  const value = e.target.value;
  const filtered = value.replace(/[^a-zA-Z0-9_]/g, "");
  setUsername(filtered);
}
