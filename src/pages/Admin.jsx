import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Package,
  Search,
  LogOut,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ShieldAlert,
  Languages,
  Menu,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { LANGUAGES } from "@/lib/i18n";
import { SERVICE_ICON_NAMES } from "@/lib/serviceIcons";



/* ----- Design tokens (scoped, no Tailwind, no shadcn) ----- */
const T = {
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  ink: "#0E0E0C",
  ink2: "#3A3A36",
  muted: "#8A8A82",
  line: "#EAE8E0",
  lineSoft: "#F0EEE7",
  accent: "#0E0E0C",
  good: "#1f7a3f",
  warn: "#9a6b00",
  bad: "#a83232",
};

const fontStack =
  '"Söhne", "Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
const serif = '"Cormorant Garamond", "Times New Roman", serif';

// Admin uses inline styles (no Tailwind), so responsiveness is driven by this
// JS breakpoint hook rather than CSS media queries.
function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

function AdminPage() {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    loading,
    logout,
    allBookings,
    updateBooking,
    deleteBooking,
    services,
    addService,
    removeService,
  } = useAuth();
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  // Admin-only data (contact messages + real registered users). Fetched here
  // rather than in AuthProvider so non-admin visitors never hit these 403 routes.
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Role guard — wait for session hydration before deciding.
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    else if (!isAdmin) navigate("/");
  }, [loading, user, isAdmin, navigate]);

  // Load admin-only data once the session is hydrated and confirmed admin.
  useEffect(() => {
    if (loading || !isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const [msgRes, userRes] = await Promise.all([
          api.listContactMessages(),
          api.listUsers(),
        ]);
        if (cancelled) return;
        setMessages(msgRes.messages ?? []);
        setUsers(userRes.users ?? []);
      } catch (e) {
        if (!cancelled) toast.error(e?.message || "Could not load admin data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, isAdmin]);

  const stats = useMemo(
    () => computeStats(allBookings, services),
    [allBookings, services]
  );
  const filtered = useMemo(
    () =>
      allBookings.filter(
        (b) =>
          !query ||
          [b.name, b.email, b.service, b.phone]
            .filter(Boolean)
            .some((s) => s.toLowerCase().includes(query.toLowerCase()))
      ),
    [allBookings, query]
  );

  if (loading || !user || !isAdmin) return <Gate user={user} isAdmin={isAdmin} />;

  const updateStatus = (id, status) => {
    updateBooking(id, status).catch((e) =>
      toast.error(e?.message || "Could not update booking.")
    );
  };
  const removeBooking = (id) => {
    deleteBooking(id).catch((e) =>
      toast.error(e?.message || "Could not delete booking.")
    );
  };


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.ink,
        fontFamily: fontStack,
        fontSize: 14,
        lineHeight: 1.5,
        letterSpacing: "-0.005em",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "232px 1fr",
      }}
    >
      {isMobile ? (
        <MobileTopNav
          tab={tab}
          setTab={setTab}
          logout={handleLogout}
          user={user}
          open={navOpen}
          setOpen={setNavOpen}
        />
      ) : (
        <Sidebar tab={tab} setTab={setTab} logout={handleLogout} user={user} />
      )}
      <main
        style={{
          padding: isMobile ? "20px 16px 64px" : "40px 48px 80px",
          maxWidth: 1280,
          width: "100%",
          minWidth: 0,
        }}
      >
        <TopBar tab={tab} />
        {tab === "overview" && <Overview stats={stats} bookings={allBookings} />}
        {tab === "bookings" && (
          <Bookings
            bookings={filtered}
            total={allBookings.length}
            services={services}
            stats={stats}
            query={query}
            setQuery={setQuery}
            updateStatus={updateStatus}
            removeBooking={removeBooking}
          />
        )}
        {tab === "users" && <UsersList users={users} />}
        {tab === "messages" && <MessagesList messages={messages} />}
        {tab === "services" && (
          <ServicesList
            services={services}
            onAdd={addService}
            onRemove={removeService}
          />
        )}
      </main>
    </div>
  );
}

// Amount (₹) for a booking = current price of its service; 0 if the service no
// longer exists (bookings store the service as a free-text name).
function serviceAmount(services, name) {
  return services.find((s) => s.name === name)?.price ?? 0;
}

function computeStats(bookings, services) {
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const pending = bookings.filter((b) => b.status?.includes("Pending")).length;
  const cancelled = bookings.filter((b) => b.status === "Cancelled").length;
  const users = new Set(bookings.map((b) => b.email).filter(Boolean)).size;
  // Revenue = confirmed bookings only. Bookings cost = every booking regardless
  // of status (pending + confirmed + cancelled). Both recompute live via useMemo.
  const revenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + serviceAmount(services, b.service), 0);
  const bookingsCost = bookings.reduce(
    (sum, b) => sum + serviceAmount(services, b.service),
    0
  );
  return { total, confirmed, pending, cancelled, users, revenue, bookingsCost };
}

/* ---------------- Role gate ---------------- */
function Gate({ user, isAdmin }) {
  const { t } = useTranslation();
  const restricted = user && !isAdmin;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: fontStack,
        color: T.ink,
      }}
    >
      <div
        style={{
          maxWidth: 380,
          width: "100%",
          background: T.surface,
          border: `1px solid ${T.line}`,
          padding: 32,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: T.lineSoft,
            display: "grid",
            placeItems: "center",
            color: T.ink2,
          }}
        >
          <ShieldAlert size={18} strokeWidth={1.6} />
        </div>
        <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 500 }}>
          {restricted ? t("admin.gate.restricted") : t("admin.gate.signIn")}
        </div>
        <p style={{ fontSize: 13, color: T.muted, marginTop: 8 }}>
          {restricted ? t("admin.gate.restrictedBody") : t("admin.gate.signInBody")}
        </p>
        <Link
          to={restricted ? "/" : "/login"}
          style={{
            display: "inline-block",
            marginTop: 20,
            fontSize: 12,
            color: T.ink,
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          {t("admin.gate.continue")}
        </Link>
      </div>
    </div>
  );
}

/* ---------------- Language pill (admin) ---------------- */
function AdminLangPicker() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
  return (
    <div style={{ position: "relative", padding: "10px 10px 16px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={t("language")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          width: "100%",
          border: `1px solid ${T.line}`,
          background: T.surface,
          color: T.ink2,
          fontFamily: fontStack,
          fontSize: 12,
          cursor: "pointer",
          borderRadius: 3,
        }}
      >
        <Languages size={13} strokeWidth={1.6} />
        <span style={{ flex: 1, textAlign: "left" }}>{current.label}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 10, right: 10, bottom: "100%",
            marginBottom: 6,
            background: T.surface,
            border: `1px solid ${T.line}`,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            zIndex: 10,
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                try { localStorage.setItem("divya_lang", l.code); } catch {}
                setOpen(false);
              }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "8px 12px",
                border: "none", background: "transparent", cursor: "pointer",
                color: T.ink, fontFamily: fontStack, fontSize: 12, textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.lineSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>{l.label}</span>
              {i18n.language === l.code && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Leaves the admin area and returns to the public website. */
function BackToSite() {
  const { t } = useTranslation();
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 3,
        marginBottom: 4,
        textDecoration: "none",
        color: T.ink2,
        fontFamily: fontStack,
        fontSize: 13,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.lineSoft)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <ArrowLeft size={15} strokeWidth={1.6} />
      {t("admin.backToSite")}
    </Link>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ tab, setTab, logout, user }) {
  const { t } = useTranslation();
  const items = [
    { id: "overview", label: t("admin.nav.overview"), icon: LayoutGrid },
    { id: "bookings", label: t("admin.nav.bookings"), icon: CalendarDays },
    { id: "users", label: t("admin.nav.users"), icon: Users },
    { id: "messages", label: t("admin.nav.messages"), icon: MessageSquare },
    { id: "services", label: t("admin.nav.services"), icon: Package },
  ];
  return (
    <aside
      style={{
        borderRight: `1px solid ${T.line}`,
        padding: "32px 20px",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: T.bg,
      }}
    >
      <div style={{ padding: "0 8px 32px" }}>
        <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, lineHeight: 1 }}>
          Divya<span style={{ color: T.muted }}>.</span>
        </div>
        <div style={{ fontSize: 10.5, color: T.muted, marginTop: 6, letterSpacing: "0.12em" }}>
          {t("admin.brand")}
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
                background: active ? T.lineSoft : "transparent",
                color: active ? T.ink : T.ink2,
                fontFamily: fontStack,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                textAlign: "left",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.lineSoft; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={15} strokeWidth={1.6} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto" }}>
        <BackToSite />
        <AdminLangPicker />
        <div
          style={{
            padding: "12px 10px",
            borderTop: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{user?.name || "Admin"}</div>
            <div style={{ fontSize: 11, color: T.muted, overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={logout}
            title={t("admin.signOut")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: T.muted,
              padding: 6,
              display: "grid",
              placeItems: "center",
            }}
          >
            <LogOut size={14} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Mobile top nav + drawer ---------------- */
function MobileTopNav({ tab, setTab, logout, user, open, setOpen }) {
  const { t } = useTranslation();
  const items = [
    { id: "overview", label: t("admin.nav.overview"), icon: LayoutGrid },
    { id: "bookings", label: t("admin.nav.bookings"), icon: CalendarDays },
    { id: "users", label: t("admin.nav.users"), icon: Users },
    { id: "messages", label: t("admin.nav.messages"), icon: MessageSquare },
    { id: "services", label: t("admin.nav.services"), icon: Package },
  ];
  const go = (id) => {
    setTab(id);
    setOpen(false);
  };
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: T.bg,
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, lineHeight: 1 }}>
          Divya<span style={{ color: T.muted }}>.</span>
        </span>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: "0.12em" }}>
          {t("admin.brand")}
        </span>
      </div>
      <button
        onClick={() => setOpen(true)}
        aria-label="Menu"
        style={{
          border: `1px solid ${T.line}`,
          background: T.surface,
          cursor: "pointer",
          width: 38,
          height: 38,
          display: "grid",
          placeItems: "center",
          color: T.ink,
          borderRadius: 3,
        }}
      >
        <Menu size={18} strokeWidth={1.6} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 260,
              maxWidth: "82vw",
              zIndex: 50,
              background: T.bg,
              borderLeft: `1px solid ${T.line}`,
              display: "flex",
              flexDirection: "column",
              padding: "16px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 6px 16px",
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 500 }}>
                Divya<span style={{ color: T.muted }}>.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: T.ink2,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {items.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 12px",
                      borderRadius: 3,
                      border: "none",
                      cursor: "pointer",
                      background: active ? T.lineSoft : "transparent",
                      color: active ? T.ink : T.ink2,
                      fontFamily: fontStack,
                      fontSize: 14,
                      fontWeight: active ? 500 : 400,
                      textAlign: "left",
                    }}
                  >
                    <Icon size={16} strokeWidth={1.6} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div style={{ marginTop: "auto" }}>
              <BackToSite />
              <AdminLangPicker />
              <div
                style={{
                  padding: "12px 10px",
                  borderTop: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{user?.name || "Admin"}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.muted,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title={t("admin.signOut")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: T.muted,
                    padding: 6,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LogOut size={14} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </header>
  );
}

/* ---------------- Top bar ---------------- */
function TopBar({ tab }) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const titles = {
    overview: t("admin.nav.overview"),
    bookings: t("admin.nav.bookings"),
    users: t("admin.nav.users"),
    messages: t("admin.nav.messages"),
    services: t("admin.nav.services"),
  };
  const localeMap = { en: "en-US", hi: "hi-IN", mr: "mr-IN" };
  const today = new Date().toLocaleDateString(localeMap[i18n.language] || "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingBottom: isMobile ? 16 : 24,
        marginBottom: isMobile ? 24 : 32,
        borderBottom: `1px solid ${T.line}`,
      }}
    >
      <div>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em", marginBottom: 6 }}>
          {today.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: serif, fontSize: isMobile ? 26 : 36, fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>
          {titles[tab]}
        </h1>
      </div>
    </header>
  );
}


/* ---------------- Overview ---------------- */
function Overview({ stats, bookings }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const recent = bookings.slice(0, 6);
  return (
    <div>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 0,
          border: `1px solid ${T.line}`,
          background: T.surface,
          marginBottom: isMobile ? 28 : 40,
        }}
      >
        <Metric label={t("admin.metrics.total")} value={stats.total} delta="+12%" up />
        <Metric label={t("admin.metrics.confirmed")} value={stats.confirmed} delta="+8%" up />
        <Metric label={t("admin.metrics.devotees")} value={stats.users} delta="+3%" up />
        <Metric label={t("admin.metrics.revenue")} value={`₹${(stats.revenue / 1000).toFixed(1)}k`} delta="-2%" />
      </section>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: isMobile ? 20 : 32 }}>
        <Block title={t("admin.overview.recent")} caption={t("admin.overview.recentCaption", { n: recent.length })}>
          {recent.length === 0 ? (
            <Empty text={t("admin.overview.emptyBookings")} />
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {recent.map((b, i) => (
                <li
                  key={b.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    padding: "14px 0",
                    borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {b.service || "Puja"}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                      {b.name || "—"} · {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusPill status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title={t("admin.overview.distribution")} caption={t("admin.overview.allTime")}>
          <Bar label={t("admin.status.confirmed")} value={stats.confirmed} total={stats.total} />
          <Bar label={t("admin.status.pending")} value={stats.pending} total={stats.total} />
          <Bar label={t("admin.status.cancelled")} value={stats.cancelled} total={stats.total} />
        </Block>
      </div>
    </div>
  );
}

function Metric({ label, value, delta, up }) {
  return (
    <div
      style={{
        padding: "22px 24px",
        borderRight: `1px solid ${T.line}`,
      }}
    >
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 12 }}>
        <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em" }}>
          {value}
        </div>
        {delta && (
          <span
            style={{
              fontSize: 11,
              color: up ? T.good : T.bad,
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function Bar({ label, value, total }) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: T.ink2 }}>{label}</span>
        <span style={{ color: T.muted }}>
          {value} <span style={{ opacity: 0.5 }}>({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div style={{ height: 2, background: T.lineSoft }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", background: T.ink }}
        />
      </div>
    </div>
  );
}

/* Money summary card used at the top of the Bookings tab. */
function SummaryCard({ label, value, caption, accent }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.line}`, padding: "18px 22px", borderRadius: 2 }}>
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 8, color: accent ? T.good : T.ink }}>
        {value}
      </div>
      {caption && <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{caption}</div>}
    </div>
  );
}

/* ---------------- Bookings ---------------- */
function Bookings({ bookings, total, services, stats, query, setQuery, updateStatus, removeBooking }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const headers = [
    t("admin.bookings.cols.devotee"),
    t("admin.bookings.cols.phone"),
    t("admin.bookings.cols.service"),
    t("admin.bookings.cols.amount"),
    t("admin.bookings.cols.date"),
    t("admin.bookings.cols.status"),
    "",
  ];
  return (
    <div>
      {/* Live money summary — computed over ALL bookings, not the filtered view. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label={t("admin.bookings.totalRevenue")}
          value={money(stats.revenue)}
          caption={t("admin.bookings.confirmedNote", { count: stats.confirmed })}
          accent
        />
        <SummaryCard
          label={t("admin.bookings.totalCost")}
          value={money(stats.bookingsCost)}
          caption={t("admin.bookings.allNote", { count: stats.total })}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: isMobile ? 10 : 0,
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 13, color: T.muted }}>
          {t("admin.bookings.showing")} <span style={{ color: T.ink, fontWeight: 500 }}>{bookings.length}</span> {t("admin.bookings.of")} {total}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${T.line}`,
            background: T.surface,
            padding: "8px 12px",
            width: isMobile ? "100%" : 300,
          }}
        >
          <Search size={14} strokeWidth={1.6} color={T.muted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.bookings.search")}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              width: "100%",
              fontFamily: fontStack,
              color: T.ink,
            }}
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <Block><Empty text={t("admin.bookings.empty")} /></Block>
      ) : (
        <div style={{ background: T.surface, border: `1px solid ${T.line}`, overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: 10.5,
                      color: T.muted,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      borderBottom: `1px solid ${T.line}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{b.name || "—"}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{b.email}</div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{b.phone || "—"}</td>
                  <td style={tdStyle}>{b.service || "—"}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                    {serviceAmount(services, b.service)
                      ? `₹${serviceAmount(services, b.service).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td style={tdStyle}>
                    {b.date || new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}><StatusPill status={b.status} /></td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <RowBtn title={t("admin.bookings.actions.confirm")} onClick={() => updateStatus(b.id, "Confirmed")}>
                        <Check size={13} strokeWidth={1.8} />
                      </RowBtn>
                      <RowBtn title={t("admin.bookings.actions.cancel")} onClick={() => updateStatus(b.id, "Cancelled")}>
                        <X size={13} strokeWidth={1.8} />
                      </RowBtn>
                      <RowBtn title={t("admin.bookings.actions.delete")} onClick={() => removeBooking(b.id)}>
                        <Trash2 size={13} strokeWidth={1.6} />
                      </RowBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RowBtn({ children, ...rest }) {
  return (
    <button
      {...rest}
      style={{
        width: 26,
        height: 26,
        border: `1px solid ${T.line}`,
        background: T.surface,
        cursor: "pointer",
        color: T.ink2,
        display: "grid",
        placeItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.lineSoft)}
      onMouseLeave={(e) => (e.currentTarget.style.background = T.surface)}
    >
      {children}
    </button>
  );
}

/* ---------------- Users ---------------- */
// Real registered accounts from GET /api/users (serializeUserAdmin):
// { id, name, email, role, joinedAt, bookingsCount }.
function UsersList({ users }) {
  const { t } = useTranslation();

  if (users.length === 0)
    return <Block><Empty text={t("admin.users.empty")} /></Block>;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.line}` }}>
      {users.map((u, i) => (
        <div
          key={u.id}
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr auto",
            gap: 18,
            alignItems: "center",
            padding: "18px 22px",
            borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.lineSoft,
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 500,
              color: T.ink,
              fontFamily: serif,
            }}
          >
            {(u.name || u.email)[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {u.name || u.email.split("@")[0]}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.email}</div>
            {u.phone && (
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{u.phone}</div>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: T.muted }}>
            <div>{t("admin.users.bookings", { count: u.bookingsCount })}</div>
            <div style={{ marginTop: 2 }}>
              {t("admin.users.joined")} {new Date(u.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Messages ---------------- */
// Contact-form submissions from GET /api/contact (serializeContactMessage):
// { id, name, email, message, createdAt }.
function MessagesList({ messages }) {
  const { t } = useTranslation();

  if (messages.length === 0)
    return <Block><Empty text={t("admin.messages.empty")} /></Block>;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.line}` }}>
      {messages.map((m, i) => (
        <div
          key={m.id}
          style={{
            padding: "18px 22px",
            borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{m.email}</div>
            </div>
            <div style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap" }}>
              {new Date(m.createdAt).toLocaleDateString()}
            </div>
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 13, color: T.ink2, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {m.message}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Services ---------------- */
function ServicesList({ services, onAdd, onRemove }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "", icon: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setErr(t("admin.services.errName"));
    if (!form.price || Number(form.price) <= 0) return setErr(t("admin.services.errPrice"));
    try {
      await onAdd(form);
      setForm({ name: "", price: "", duration: "", description: "", icon: "" });
      setErr("");
      setOpen(false);
    } catch (e2) {
      setErr(e2?.message || "Could not add service.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 13, color: T.muted }}>
          <span style={{ color: T.ink, fontWeight: 500 }}>{services.length}</span> {t("admin.services.active", { count: services.length })}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "none",
            background: T.ink,
            color: "#fff",
            fontFamily: fontStack,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: 2,
            letterSpacing: "0.02em",
          }}
        >
          {open ? <X size={13} strokeWidth={2} /> : <Plus size={13} strokeWidth={2} />}
          {open ? t("admin.services.cancel") : t("admin.services.newService")}
        </button>
      </div>

      {open && (
        <motion.form
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          style={{
            background: T.surface,
            border: `1px solid ${T.line}`,
            padding: 20,
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <Field label={t("admin.services.name")}>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Maha Mrityunjaya Jaap"
              style={inputStyle}
            />
          </Field>
          <Field label={t("admin.services.price")}>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="11000"
              style={inputStyle}
            />
          </Field>
          <Field label={t("admin.services.duration")}>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="2 hrs"
              style={inputStyle}
            />
          </Field>
          <Field label={t("admin.services.icon")}>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              style={inputStyle}
            >
              <option value="">{t("admin.services.iconDefault")}</option>
              {SERVICE_ICON_NAMES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </Field>
          <button
            type="submit"
            style={{
              height: 38,
              padding: "0 18px",
              border: "none",
              background: T.ink,
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 2,
              fontFamily: fontStack,
            }}
          >
            {t("admin.services.add")}
          </button>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label={t("admin.services.description")}>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder={t("admin.services.descriptionPlaceholder")}
                rows={2}
                style={{ ...inputStyle, resize: "vertical", minHeight: 56 }}
              />
            </Field>
          </div>
          {err && (
            <div style={{ gridColumn: "1 / -1", fontSize: 12, color: T.bad, marginTop: -4 }}>
              {err}
            </div>
          )}
        </motion.form>
      )}

      <div style={{ background: T.surface, border: `1px solid ${T.line}`, overflowX: isMobile ? "auto" : "visible" }}>
        {services.length === 0 ? (
          <Empty text={t("admin.services.empty")} />
        ) : (
          services.map((s, i) => (
            <div
              key={s.id || s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr 110px 130px 32px",
                minWidth: isMobile ? 460 : "auto",
                alignItems: "center",
                gap: 20,
                padding: isMobile ? "18px 18px" : "20px 24px",
                borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`,
              }}
            >
              <div style={{ fontSize: 11, color: T.muted, fontVariantNumeric: "tabular-nums" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500 }}>{s.name}</div>
                {s.description && (
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2, fontFamily: fontStack }}>
                    {s.description}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>{s.duration}</div>
              <div style={{ fontSize: 14, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                ₹{Number(s.price).toLocaleString("en-IN")}
              </div>
              <button
                onClick={() => {
                  if (confirm(t("admin.services.confirmRemove", { name: s.name }))) {
                    Promise.resolve(onRemove(s.id)).catch((e) =>
                      toast.error(e?.message || "Could not remove service.")
                    );
                  }
                }}
                title={t("admin.bookings.actions.delete")}
                style={{
                  width: 26,
                  height: 26,
                  border: `1px solid ${T.line}`,
                  background: T.surface,
                  cursor: "pointer",
                  color: T.ink2,
                  display: "grid",
                  placeItems: "center",
                  justifySelf: "end",
                }}
              >
                <Trash2 size={13} strokeWidth={1.6} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


/* ---------------- Helpers ---------------- */
function Block({ title, caption, children }) {
  return (
    <section
      style={{
        background: T.surface,
        border: `1px solid ${T.line}`,
        padding: 24,
      }}
    >
      {(title || caption) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
          }}
        >
          {title && <h2 style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{title}</h2>}
          {caption && <div style={{ fontSize: 11, color: T.muted }}>{caption}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

function StatusPill({ status }) {
  const { t } = useTranslation();
  const map = {
    Confirmed: { color: T.good, dot: T.good, label: t("admin.status.confirmed") },
    Cancelled: { color: T.bad, dot: T.bad, label: t("admin.status.cancelled") },
  };
  const cfg = map[status] || { color: T.warn, dot: T.warn, label: t("admin.status.pending") };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: cfg.color,
        fontWeight: 500,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Empty({ text }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center", color: T.muted, fontSize: 13 }}>
      {text}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <label style={{ fontSize: 11, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ marginTop: 6 }}>{children}</div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${T.line}`,
  background: T.surface,
  fontSize: 14,
  color: T.ink,
  outline: "none",
  fontFamily: fontStack,
  boxSizing: "border-box",
  borderRadius: 2,
};
const primaryBtn = {
  marginTop: 28,
  width: "100%",
  padding: "12px",
  border: "none",
  background: T.ink,
  color: "#fff",
  fontFamily: fontStack,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  letterSpacing: "0.01em",
  borderRadius: 2,
};
const tdStyle = {
  padding: "16px 20px",
  verticalAlign: "middle",
};

export default AdminPage;
