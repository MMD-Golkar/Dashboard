const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const makeResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

export const mockSignup = async (payload) => {
  await delay(800); // fake network time so you can see the loading state

  // trigger each scenario by what you type in the form
  if (payload.email === "offline@test.com")
    throw new TypeError("Failed to fetch"); // network failure

  if (payload.email === "taken@test.com")
    return makeResponse(409, { field: "email", message: "Email already registered" });

  if (payload.username === "admin")
    return makeResponse(409, { field: "username", message: "Username already taken" });

  if (payload.email === "invalid@test.com")
    return makeResponse(400, {
      errors: { phone: "Phone number is not valid", password: "Password is too weak" },
    });

  if (payload.email === "server@test.com")
    return makeResponse(500, { message: "Server error" });

  if (payload.email === "html@test.com")
    return { ok: false, status: 502, json: async () => { throw new Error("not json"); } };

  // everything else succeeds
  return makeResponse(201, {
    token: "fake-token-123",
    user: { id: "1", name: payload.name, email: payload.email },
  });
};

/*

0900033422333


mmdoogolgol


thisispass1334


*/