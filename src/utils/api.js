const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(path, options = {}) {
  const {
    authenticated = true,
    body,
    headers = {},
    ...requestOptions
  } = options;
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) requestHeaders["Content-Type"] = "application/json";
  if (authenticated) {
    const token = localStorage.getItem("token");
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "درخواست انجام نشد.");
    error.status = response.status;
    error.errors = data.errors;
    error.field = data.field;
    throw error;
  }

  return data;
}