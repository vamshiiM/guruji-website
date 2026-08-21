import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { useAuth } from "@/lib/auth";
import { iconFor } from "@/lib/serviceIcons";

function Services() {
  const { t } = useTranslation();
  const { services, loading } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <span className="eyebrow">{t("services.eyebrow")}</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance max-w-3xl">{t("services.title")}</h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">{t("services.sub")}</p>
      </Reveal>

      {loading ? (
        <p className="mt-16 text-muted-foreground">{t("services.loading")}</p>
      ) : services.length === 0 ? (
        <p className="mt-16 text-muted-foreground">{t("services.empty")}</p>
      ) : (
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = iconFor(s.icon);
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.08}>
                <div className="glass-card p-7 h-full flex flex-col">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{s.description}</p>
                  <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-widest">
                    <span style={{ color: "var(--saffron)" }}>{t("common.from")} ₹{Number(s.price).toLocaleString("en-IN")}</span>
                    <span className="text-muted-foreground">{s.duration}</span>
                  </div>
                  <Link to="/booking" className="btn-ghost mt-6 text-sm !py-2">{t("services.book")}</Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Services;
