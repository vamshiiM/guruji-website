// Thin fetch wrapper around the backend API.
// - Sends the httpOnly auth cookie on every request (credentials: "include").
// - Base URL comes from VITE_API_URL (e.g. http://localhost:4000 in dev).
// - On a non-2xx response, throws an Error whose `.code` is the server's error
//   code (e.g. "BAD_ADMIN", "RESERVED_EMAIL") so callers can branch on it.

const BASE = import.meta.env.VITE_API_URL ?? "";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error?.message || "Request failed");
    err.code = data?.error?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  me: () => request("/api/auth/me"),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  signup: (name, email, password) =>
    request("/api/auth/signup", { method: "POST", body: { name, email, password } }),
  logout: () => request("/api/auth/logout", { method: "POST" }),

  // bookings
  listBookings: () => request("/api/bookings"),
  createBooking: (booking) => request("/api/bookings", { method: "POST", body: booking }),
  updateBooking: (id, status) => request(`/api/bookings/${id}`, { method: "PATCH", body: { status } }),
  deleteBooking: (id) => request(`/api/bookings/${id}`, { method: "DELETE" }),

  // services
  listServices: () => request("/api/services"),
  addService: (service) => request("/api/services", { method: "POST", body: service }),
  removeService: (id) => request(`/api/services/${id}`, { method: "DELETE" }),

  // contact
  contact: (message) => request("/api/contact", { method: "POST", body: message }),
};
