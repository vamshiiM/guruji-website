import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { CalendarCheck, CalendarDays, Clock, ArrowRight } from "lucide-react";

// --- date helpers (local time, "YYYY-MM-DD") ------------------------------
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => toISO(new Date());
const addDaysISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};
// Current local time as "HH:MM" — comparable lexicographically to slot values.
const nowHM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Curated "preferred time" slots. The pandit confirms the final muhurta, so
// these are hints rather than exact appointment times. Stored as "HH:MM".
const TIME_SLOTS = ["06:00", "07:30", "09:00", "11:00", "16:00", "18:00", "19:30"];
const DEFAULT_PHONE = "+91 "; // most devotees are in India — prefill the code.
const LOCALES = { en: "en-US", hi: "hi-IN", mr: "mr-IN" };
const formatTime = (value, locale) => {
  const [h, m] = value.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
};

// Nicely formatted echo of the chosen date, e.g. "Fri, 22 Aug 2026".
const formatDate = (iso, locale) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function Booking() {
  const { user, addBooking, services } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = LOCALES[i18n.language] || "en-US";
  const [form, setForm] = useState({
    service: "",
    date: "",
    time: "",
    address: "",
    notes: "",
    name: user?.name ?? "",
    phone: DEFAULT_PHONE,
  });
  const [customTime, setCustomTime] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default the service to the first one once services have loaded.
  useEffect(() => {
    if (!form.service && services.length) {
      setForm((f) => ({ ...f, service: services[0].name }));
    }
  }, [services, form.service]);

  // If the chosen date is today, drop any time that has already passed.
  useEffect(() => {
    if (form.date === todayISO() && form.time && form.time < nowHM()) {
      setForm((f) => ({ ...f, time: "" }));
      setCustomTime(false);
    }
  }, [form.date]); // re-check whenever the date changes

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a ceremony");
      navigate("/login");
      return;
    }
    if ((form.phone.match(/\d/g) || []).length < 7) {
      toast.error(t("booking.errors.phone"));
      return;
    }
    if (!form.date || form.date < todayISO()) {
      toast.error(t("booking.errors.pastDate"));
      return;
    }
    if (!form.time) {
      toast.error(t("booking.errors.timeRequired"));
      return;
    }
    if (form.date === todayISO() && form.time < nowHM()) {
      toast.error(t("booking.errors.pastTime"));
      return;
    }
    setLoading(true);
    try {
      await addBooking({
        service: form.service,
        date: form.date,
        time: form.time,
        address: form.address,
        notes: form.notes,
        name: form.name,
        phone: form.phone,
      });
      toast.success("Booking received — view it in your profile 🙏");
      setForm({ ...form, date: "", time: "", address: "", notes: "", phone: DEFAULT_PHONE });
      setCustomTime(false);
      navigate("/profile");
    } catch (err) {
      toast.error(err?.message || "Could not submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  // Phone accepts digits and common separators only — letters are stripped as typed.
  const onPhone = (e) =>
    setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\-\s()]/g, "") }));

  const isToday = form.date === todayISO();

  const quickDates = [
    { key: "today", value: addDaysISO(0) },
    { key: "tomorrow", value: addDaysISO(1) },
    { key: "nextWeek", value: addDaysISO(7) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <span className="eyebrow">{t("booking.eyebrow")}</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{t("booking.title")}</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">{t("booking.sub")}</p>
      </Reveal>

      <Reveal delay={0.15}>
        <form onSubmit={onSubmit} className="glass-card mt-12 p-8 md:p-10 grid md:grid-cols-2 gap-5">
          <Field label={t("booking.fields.service")}>
            <select value={form.service} onChange={set("service")} className={inputCls}>
              {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </Field>
          <Field label={t("booking.fields.phone")}>
            <input type="tel" inputMode="tel" required placeholder="98765 43210" value={form.phone} onChange={onPhone} className={inputCls} />
          </Field>

          {/* Date — icon input with min=today + quick picks */}
          <Field label={t("booking.fields.date")} full>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <CalendarDays size={18} />
              </span>
              <input
                type="date"
                required
                min={todayISO()}
                value={form.date}
                onChange={set("date")}
                className={`${inputCls} pl-11`}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {quickDates.map((q) => (
                <Chip key={q.key} active={form.date === q.value} onClick={() => setForm((f) => ({ ...f, date: q.value }))}>
                  {t(`booking.date.${q.key}`)}
                </Chip>
              ))}
              {form.date && (
                <span className="ml-auto self-center text-xs text-muted-foreground">
                  {formatDate(form.date, locale)}
                </span>
              )}
            </div>
          </Field>

          {/* Time — preset slot chips, with an "Other" escape hatch */}
          <Field label={t("booking.fields.time")} full>
            <div className="flex flex-wrap gap-2.5">
              {TIME_SLOTS.map((v) => {
                const past = isToday && v < nowHM();
                return (
                  <Chip
                    key={v}
                    active={!customTime && form.time === v}
                    disabled={past}
                    onClick={() => { setCustomTime(false); setForm((f) => ({ ...f, time: v })); }}
                  >
                    {formatTime(v, locale)}
                  </Chip>
                );
              })}
              <Chip active={customTime} onClick={() => setCustomTime(true)}>
                {t("booking.time.other")}
              </Chip>
            </div>
            {customTime && (
              <div className="relative mt-3 max-w-[200px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Clock size={18} />
                </span>
                <input
                  type="time"
                  autoFocus
                  min={isToday ? nowHM() : undefined}
                  value={form.time}
                  onChange={set("time")}
                  className={`${inputCls} pl-11`}
                />
              </div>
            )}
          </Field>

          <Field label={t("booking.fields.name")} full>
            <input required value={form.name} onChange={set("name")} className={inputCls} />
          </Field>
          <Field label={t("booking.fields.address")} full>
            <input required value={form.address} onChange={set("address")} className={inputCls} />
          </Field>
          <Field label={t("booking.fields.notes")} full>
            <textarea rows={4} value={form.notes} onChange={set("notes")} className={inputCls} />
          </Field>
          <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap pt-2">
            <p className="text-xs text-muted-foreground">{t("booking.terms")}</p>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? t("common.sending") : <><CalendarCheck size={18} /> {t("booking.cta")} <ArrowRight size={16} /></>}
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}

const inputCls = "w-full bg-background/60 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition";

function Chip({ active, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        disabled
          ? "border-border text-muted-foreground/40 line-through cursor-not-allowed"
          : active
          ? "border-transparent text-white shadow-sm"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
      style={active && !disabled ? { background: "linear-gradient(135deg, var(--saffron), var(--gold))" } : undefined}
    >
      {children}
    </button>
  );
}

function Field({ label, children, full }) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default Booking;
