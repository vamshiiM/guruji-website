import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { CalendarCheck, ArrowRight } from "lucide-react";



const services = ["Griha Pravesh", "Satyanarayan Katha", "Vedic Wedding", "Namkaran Sanskar", "Maha Mrityunjaya Jaap", "Navagraha Shanti", "Lakshmi Puja", "Surya Namaskar Yagna", "Pitra Tarpan"];

function Booking() {
  const { user, addBooking } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    service: services[0],
    date: "",
    time: "",
    address: "",
    notes: "",
    name: user?.name ?? "",
    phone: "",
    email: user?.email ?? "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a ceremony");
      navigate("/login");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    addBooking({
      service: form.service,
      date: form.date,
      time: form.time,
      address: form.address,
      notes: form.notes,
      name: form.name,
      phone: form.phone,
    });
    setLoading(false);
    toast.success("Booking received — view it in your profile 🙏");
    setForm({ ...form, date: "", time: "", address: "", notes: "", phone: "" });
    navigate("/profile");
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
              {services.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label={t("booking.fields.date")}>
            <input type="date" required value={form.date} onChange={set("date")} className={inputCls} />
          </Field>
          <Field label={t("booking.fields.time")}>
            <input type="time" required value={form.time} onChange={set("time")} className={inputCls} />
          </Field>
          <Field label={t("booking.fields.phone")}>
            <input type="tel" required placeholder="+91 ..." value={form.phone} onChange={set("phone")} className={inputCls} />
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

function Field({ label, children, full }) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default Booking;
