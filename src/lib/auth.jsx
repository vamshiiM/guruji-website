import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  // true until the first /auth/me + /services resolve, so guards can wait for
  // hydration instead of flashing the signed-out state.
  const [loading, setLoading] = useState(true);

  // Hydrate session + reference data on load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [meRes, servicesRes] = await Promise.all([
          api.me().catch(() => ({ user: null })),
          api.listServices().catch(() => ({ services: [] })),
        ]);
        if (cancelled) return;
        setServices(servicesRes.services ?? []);
        if (meRes.user) {
          setUser(meRes.user);
          const { bookings } = await api.listBookings().catch(() => ({ bookings: [] }));
          if (!cancelled) setBookings(bookings ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshBookings = async () => {
    const { bookings } = await api.listBookings().catch(() => ({ bookings: [] }));
    setBookings(bookings ?? []);
  };

  // Auth ---------------------------------------------------------------------
  const login = async (email, password) => {
    const { user } = await api.login(email, password);
    setUser(user);
    await refreshBookings();
    return { role: user.role };
  };

  const signup = async (name, email, password) => {
    const { user } = await api.signup(name, email, password);
    setUser(user);
    await refreshBookings();
    return { role: user.role };
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
    setBookings([]);
  };

  // Bookings -----------------------------------------------------------------
  const addBooking = async (booking) => {
    const { booking: created } = await api.createBooking(booking);
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const updateBooking = async (id, status) => {
    const { booking: updated } = await api.updateBooking(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  };

  const deleteBooking = async (id) => {
    await api.deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Services -----------------------------------------------------------------
  const addService = async ({ name, price, duration }) => {
    const { service } = await api.addService({ name, price, duration });
    setServices((prev) => [...prev, service]);
    return service;
  };

  const removeService = async (id) => {
    await api.removeService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const isAdmin = user?.role === "admin";

  return (
    <Ctx.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        signup,
        logout,
        // Server already scopes bookings by role, so `bookings` and `allBookings`
        // are the same array (admin: all; user: own).
        bookings,
        allBookings: bookings,
        addBooking,
        updateBooking,
        deleteBooking,
        services,
        addService,
        removeService,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
