const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const makeResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

export const mockLogin = async ({ username, password }) => {
  await delay(800); // fake network time

  if (username === "offline") throw new TypeError("Failed to fetch");

  if (username === "server")
    return makeResponse(500, { message: "خطای سرور" });

  if (password === "wrongpass")
    return makeResponse(401, { message: "نام کاربری یا رمز عبور اشتباه است" });

  // everything else succeeds
  return makeResponse(200, {
    token: "fake-token-123",
    user: { id: "1", username },
  });
};