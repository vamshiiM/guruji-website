
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";



function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.contact(form);
      toast.success("🙏");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err?.message || "Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <span className="eyebrow">{t("contact.eyebrow")}</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{t("contact.title")}</h1>
      </Reveal>

      <div className="mt-16 grid md:grid-cols-2 gap-12">
        <Reveal>
          <div className="space-y-6">
            <ContactItem icon={Phone} label={t("contact.phone")} value="+91 98765 43210" />
            <ContactItem icon={Mail} label={t("contact.email")} value="hello@divyaseva.in" />
            <ContactItem icon={MapPin} label={t("contact.based")} value="Varanasi, India" />
            <div className="gold-divider !my-8" />
            <p className="text-sm text-muted-foreground leading-relaxed">{t("contact.note")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={onSubmit} className="glass-card p-8 space-y-4">
            <Field label={t("contact.fields.name")}>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("contact.fields.email")}>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </Field>
            <Field label={t("contact.fields.message")}>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputCls} />
            </Field>
            <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? t("common.sending") : <>{t("common.send")} <ArrowRight size={16} /></>}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}

const inputCls = "mt-2 w-full bg-background/60 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full shrink-0"
        style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-xl">{value}</p>
      </div>
    </div>
  );
}

export default Contact;
