import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  // Methods are wrapped in useCallback so their identity is stable; the context
  // value below is memoized so consumers only re-render when the actual data
  // (user/bookings/services/loading) changes — not on every provider render.
  const refreshBookings = useCallback(async () => {
    const { bookings } = await api.listBookings().catch(() => ({ bookings: [] }));
    setBookings(bookings ?? []);
  }, []);

  // Auth ---------------------------------------------------------------------
  const login = useCallback(async (email, password) => {
    const { user } = await api.login(email, password);
    setUser(user);
    await refreshBookings();
    return { role: user.role };
  }, [refreshBookings]);

  const signup = useCallback(async (name, email, password) => {
    const { user } = await api.signup(name, email, password);
    setUser(user);
    await refreshBookings();
    return { role: user.role };
  }, [refreshBookings]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
    setBookings([]);
  }, []);

  const changePassword = useCallback(
    (currentPassword, newPassword) => api.changePassword(currentPassword, newPassword),
    []
  );

  // Bookings -----------------------------------------------------------------
  const addBooking = useCallback(async (booking) => {
    const { booking: created } = await api.createBooking(booking);
    setBookings((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateBooking = useCallback(async (id, status) => {
    const { booking: updated } = await api.updateBooking(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    return updated;
  }, []);

  const deleteBooking = useCallback(async (id) => {
    await api.deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Services -----------------------------------------------------------------
  const addService = useCallback(async ({ name, price, duration, description, icon }) => {
    const { service } = await api.addService({ name, price, duration, description, icon });
    setServices((prev) => [...prev, service]);
    return service;
  }, []);

  const removeService = useCallback(async (id) => {
    await api.removeService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      login,
      signup,
      logout,
      changePassword,
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
    }),
    [
      user,
      isAdmin,
      loading,
      login,
      signup,
      logout,
      changePassword,
      bookings,
      addBooking,
      updateBooking,
      deleteBooking,
      services,
      addService,
      removeService,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
