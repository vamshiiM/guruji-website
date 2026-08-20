import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { Flame, Sparkles, Star, Home, Heart, Baby, Gem, Sun, Moon } from "lucide-react";



const all = [
  { icon: Home, title: "Griha Pravesh", desc: "Housewarming ritual to consecrate a new home.", price: "5,100", dur: "2.5 hrs" },
  { icon: Flame, title: "Satyanarayan Katha", desc: "Monthly puja honoring Lord Vishnu.", price: "3,100", dur: "2 hrs" },
  { icon: Heart, title: "Vedic Wedding", desc: "Complete saat-phera ceremony.", price: "21,000", dur: "Full day" },
  { icon: Baby, title: "Namkaran Sanskar", desc: "Naming ceremony for the newborn.", price: "4,100", dur: "1.5 hrs" },
  { icon: Sparkles, title: "Maha Mrityunjaya Jaap", desc: "108 mantra recitation for healing.", price: "5,500", dur: "3 hrs" },
  { icon: Star, title: "Navagraha Shanti", desc: "Planetary peace ritual.", price: "7,500", dur: "3 hrs" },
  { icon: Gem, title: "Lakshmi Puja", desc: "Invoking prosperity and abundance.", price: "3,500", dur: "1.5 hrs" },
  { icon: Sun, title: "Surya Namaskar Yagna", desc: "Sun ritual for vitality and clarity.", price: "4,500", dur: "2 hrs" },
  { icon: Moon, title: "Pitra Tarpan", desc: "Shraddha ritual for ancestors.", price: "3,800", dur: "2 hrs" },
];

function Services() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <span className="eyebrow">{t("services.eyebrow")}</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance max-w-3xl">{t("services.title")}</h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">{t("services.sub")}</p>
      </Reveal>

      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {all.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <div className="glass-card p-7 h-full flex flex-col">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
                <s.icon size={20} className="text-white" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{s.desc}</p>
              <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-widest">
                <span style={{ color: "var(--saffron)" }}>{t("common.from")} ₹{s.price}</span>
                <span className="text-muted-foreground">{s.dur}</span>
              </div>
              <Link to="/booking" className="btn-ghost mt-6 text-sm !py-2">{t("services.book")}</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default Services;
