import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
const KEY = "divya_user";
const BOOKINGS_KEY = "divya_bookings";
const SERVICES_KEY = "divya_services";

// Role configuration ---------------------------------------------------------
// Anyone in ADMIN_EMAILS must sign in with ADMIN_PASSWORD to receive the
// "admin" role. Everyone else is granted the "user" role.
const ADMIN_EMAILS = ["admin@divya.com", "guruji@divya.com"];
const ADMIN_PASSWORD = "guruji108";

const DEFAULT_SERVICES = [
  { id: "svc_1", name: "Vedic Wedding", price: 51000, duration: "4–6 hrs" },
  { id: "svc_2", name: "Satyanarayan Katha", price: 11000, duration: "2 hrs" },
  { id: "svc_3", name: "Griha Pravesh", price: 21000, duration: "3 hrs" },
  { id: "svc_4", name: "Navagraha Puja", price: 15000, duration: "2 hrs" },
  { id: "svc_5", name: "Rudra Abhishek", price: 9000, duration: "1.5 hrs" },
];

// Sample bookings shown on first run so the admin dashboard isn't empty.
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysAhead = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const SAMPLE_BOOKINGS = [
  { id: "bkg_s1", name: "Rohan Sharma",   email: "rohan.sharma@gmail.com",    phone: "+91 98200 11221", service: "Vedic Wedding",      date: daysAhead(12), status: "Confirmed",           createdAt: daysAgo(2),  notes: "Outdoor mandap, 200 guests." },
  { id: "bkg_s2", name: "Priya Iyer",     email: "priya.iyer@outlook.com",    phone: "+91 99870 33445", service: "Satyanarayan Katha", date: daysAhead(4),  status: "Confirmed",           createdAt: daysAgo(3),  notes: "Sunday morning." },
  { id: "bkg_s3", name: "Aditya Verma",   email: "aditya.v@yahoo.com",        phone: "+91 98112 77881", service: "Griha Pravesh",      date: daysAhead(7),  status: "Pending confirmation", createdAt: daysAgo(1),  notes: "New flat in Andheri." },
  { id: "bkg_s4", name: "Meera Nair",     email: "meera.nair@gmail.com",      phone: "+91 90043 55667", service: "Navagraha Puja",     date: daysAhead(2),  status: "Confirmed",           createdAt: daysAgo(6),  notes: "" },
  { id: "bkg_s5", name: "Karan Mehta",    email: "karan.mehta@hotmail.com",   phone: "+91 98765 41200", service: "Rudra Abhishek",     date: daysAhead(1),  status: "Pending confirmation", createdAt: daysAgo(1),  notes: "Monday morning slot." },
  { id: "bkg_s6", name: "Ananya Gupta",   email: "ananya.g@gmail.com",        phone: "+91 99201 88990", service: "Satyanarayan Katha", date: daysAhead(10), status: "Confirmed",           createdAt: daysAgo(8),  notes: "" },
  { id: "bkg_s7", name: "Rohan Sharma",   email: "rohan.sharma@gmail.com",    phone: "+91 98200 11221", service: "Navagraha Puja",     date: daysAhead(20), status: "Pending confirmation", createdAt: daysAgo(0),  notes: "Pre-wedding shanti." },
  { id: "bkg_s8", name: "Vikram Singh",   email: "vikram.singh@gmail.com",    phone: "+91 97011 22334", service: "Griha Pravesh",      date: daysAgo(3),    status: "Cancelled",           createdAt: daysAgo(9),  notes: "Postponed by family." },
  { id: "bkg_s9", name: "Sneha Kulkarni", email: "sneha.kulkarni@gmail.com",  phone: "+91 98220 60401", service: "Rudra Abhishek",     date: daysAhead(5),  status: "Confirmed",           createdAt: daysAgo(4),  notes: "" },
  { id: "bkg_s10", name: "Arjun Pillai",  email: "arjun.pillai@gmail.com",    phone: "+91 96000 47755", service: "Vedic Wedding",      date: daysAhead(45), status: "Pending confirmation", createdAt: daysAgo(5),  notes: "Destination wedding — Goa." },
];

function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState(DEFAULT_SERVICES);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
    const b = localStorage.getItem(BOOKINGS_KEY);
    if (b) {
      try {
        const parsed = JSON.parse(b);
        if (Array.isArray(parsed)) setBookings(parsed);
      } catch {}
    } else {
      // First run — seed sample data so the admin dashboard isn't empty.
      setBookings(SAMPLE_BOOKINGS);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(SAMPLE_BOOKINGS));
    }
    const s = localStorage.getItem(SERVICES_KEY);
    if (s) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length) setServices(parsed);
      } catch {}
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(KEY, JSON.stringify(u));
      else localStorage.removeItem(KEY);
    }
  };

  const persistBookings = (list) => {
    setBookings(list);
    if (typeof window !== "undefined") {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    }
  };

  const persistServices = (list) => {
    setServices(list);
    if (typeof window !== "undefined") {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(list));
    }
  };

  // Auth ---------------------------------------------------------------------
  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 500));
    const normalized = email.trim().toLowerCase();
    if (isAdminEmail(normalized)) {
      if (password !== ADMIN_PASSWORD) {
        const err = new Error("Invalid admin credentials");
        err.code = "BAD_ADMIN";
        throw err;
      }
      persist({
        name: "Guruji",
        email: normalized,
        role: "admin",
        joinedAt: new Date().toISOString(),
      });
      return { role: "admin" };
    }
    persist({
      name: email.split("@")[0],
      email: normalized,
      role: "user",
      joinedAt: new Date().toISOString(),
    });
    return { role: "user" };
  };

  const signup = async (name, email) => {
    await new Promise((r) => setTimeout(r, 500));
    const normalized = email.trim().toLowerCase();
    if (isAdminEmail(normalized)) {
      const err = new Error("This email is reserved.");
      err.code = "RESERVED_EMAIL";
      throw err;
    }
    persist({
      name,
      email: normalized,
      role: "user",
      joinedAt: new Date().toISOString(),
    });
    return { role: "user" };
  };

  const logout = () => persist(null);

  // Bookings -----------------------------------------------------------------
  const addBooking = (booking) => {
    const entry = {
      id: `bkg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "Pending confirmation",
      email: user?.email,
      ...booking,
    };
    persistBookings([entry, ...bookings]);
    return entry;
  };

  const userBookings =
    user?.role === "admin"
      ? bookings
      : user
      ? bookings.filter((b) => b.email === user.email)
      : [];

  // Services -----------------------------------------------------------------
  const addService = ({ name, price, duration }) => {
    const entry = {
      id: `svc_${Date.now()}`,
      name: name.trim(),
      price: Number(price) || 0,
      duration: (duration || "").trim() || "1 hr",
    };
    persistServices([...services, entry]);
    return entry;
  };

  const removeService = (id) =>
    persistServices(services.filter((s) => s.id !== id));

  const isAdmin = user?.role === "admin";

  return (
    <Ctx.Provider
      value={{
        user,
        isAdmin,
        login,
        signup,
        logout,
        bookings: userBookings,
        allBookings: bookings,
        addBooking,
        setBookings: persistBookings,
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
