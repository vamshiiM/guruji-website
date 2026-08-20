import { useNavigate, Link } from "react-router-dom";
import { Reveal } from "@/components/site/Reveal";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  LogOut,
  CalendarCheck,
  ArrowRight,
  Flame,
} from "lucide-react";



function Profile() {
  const { user, bookings, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Once session hydration finishes, redirect signed-out visitors.
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="text-muted-foreground">Loading your profile…</p>
      </div>
    );
  }

  const totalBookings = bookings.length;
  const upcoming = bookings.filter((b) => b.date && new Date(b.date) >= new Date(new Date().toDateString()));
  const past = bookings.filter((b) => !b.date || new Date(b.date) < new Date(new Date().toDateString()));

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      {/* Header card */}
      <Reveal>
        <div className="glass-card p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
          <div className="flex items-center gap-5">
            <motion.span
              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}
            >
              <Flame size={26} />
            </motion.span>
            <div>
              <span className="eyebrow">Namaste</span>
              <h1 className="mt-1 font-display text-4xl md:text-5xl capitalize">{user.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                <Mail size={14} /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/booking" className="btn-primary text-sm !py-2.5 !px-5">
              <CalendarCheck size={16} /> New booking
            </Link>
            <button
              onClick={() => {
                logout();
                toast.success("Signed out");
                navigate("/");
              }}
              className="btn-ghost text-sm !py-2.5 !px-5"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Sparkles size={18} />} label="Total ceremonies" value={totalBookings} delay={0.05} />
        <StatCard icon={<CalendarDays size={18} />} label="Upcoming" value={upcoming.length} delay={0.12} />
        <StatCard icon={<UserIcon size={18} />} label="Member since" value={formatJoin(user.joinedAt)} delay={0.2} />
      </div>

      {/* Booking history */}
      <Reveal delay={0.15}>
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="eyebrow">Your journey</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">Booking history</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalBookings === 0 ? "No bookings yet." : `${totalBookings} ceremon${totalBookings === 1 ? "y" : "ies"} on record.`}
            </p>
          </div>

          {totalBookings === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-8 space-y-10">
              {upcoming.length > 0 && (
                <Section title="Upcoming" items={upcoming} accent />
              )}
              {past.length > 0 && (
                <Section title="Past ceremonies" items={past} />
              )}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function Section({ title, items, accent }) {
  return (
    <div>
      <h3 className="font-display text-xl mb-4 inline-flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: accent ? "var(--saffron)" : "color-mix(in oklab, var(--gold) 60%, transparent)" }}
        />
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((b, i) => (
          <BookingRow key={b.id} b={b} i={i} />
        ))}
      </ul>
    </div>
  );
}

function BookingRow({ b, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      className="glass-card p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:justify-between"
    >
      <div className="flex items-start gap-4">
        <span
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}
        >
          <Sparkles size={16} />
        </span>
        <div>
          <p className="font-display text-xl">{b.service}</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} /> {formatDate(b.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} /> {b.time || "—"}
            </span>
            {b.address && (
              <span className="inline-flex items-center gap-1.5 max-w-xs truncate">
                <MapPin size={13} /> {b.address}
              </span>
            )}
          </div>
          {b.notes && (
            <p className="mt-3 text-sm text-foreground/75 italic">"{b.notes}"</p>
          )}
        </div>
      </div>

      <div className="md:text-right">
        <span
          className="inline-block text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border"
          style={{
            borderColor: "color-mix(in oklab, var(--gold) 35%, transparent)",
            background: "color-mix(in oklab, var(--gold) 12%, transparent)",
            color: "var(--gold)",
          }}
        >
          {b.status}
        </span>
        <p className="mt-2 text-[11px] text-muted-foreground">Booked {formatDate(b.createdAt)}</p>
      </div>
    </motion.li>
  );
}

function StatCard({ icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 flex items-center gap-4"
    >
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: "color-mix(in oklab, var(--saffron) 14%, transparent)",
          color: "var(--saffron)",
        }}
      >
        {icon}
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-display text-2xl">{value}</p>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card mt-8 p-10 text-center">
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white mx-auto"
        style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}
      >
        <CalendarDays size={22} />
      </span>
      <h3 className="mt-5 font-display text-2xl">No ceremonies yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Book your first puja and it will appear here for you to track.
      </p>
      <Link to="/booking" className="btn-primary mt-6 inline-flex">
        Book a ceremony <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatJoin(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export default Profile;
