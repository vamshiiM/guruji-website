
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import pujaImg from "@/assets/puja-hands.jpg";
import { Award, BookOpen, HeartHandshake } from "lucide-react";



function About() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <span className="eyebrow">{t("about.eyebrow")}</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{t("about.title")}</h1>
      </Reveal>

      <div className="mt-16 grid md:grid-cols-5 gap-12 items-start">
        <Reveal className="md:col-span-2">
          <img src={pujaImg} alt="Pandit Ji" loading="lazy" className="rounded-2xl shadow-xl aspect-[4/5] w-full object-cover" />
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-3">
          <p className="text-lg leading-relaxed text-foreground/85">
            Born in the temple town of Varanasi, Pandit Shastri Ji began his Vedic studies at the age of nine
            under his grandfather, a respected scholar of the Rig Veda. Over the following two decades he trained
            in Sanskrit, jyotish, and the four classical paths of worship — eventually earning his Acharya degree
            from Sampurnanand Sanskrit Vishwavidyalaya.
          </p>
          <p className="mt-5 text-foreground/85 leading-relaxed">
            Today he serves families across India and abroad — from intimate daily pujas to large family weddings.
            His approach is unhurried, transparent and deeply rooted in shastra, while remaining warm and accessible
            to every generation.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, title: "Acharya", sub: "Sanskrit & Karmakanda" },
              { icon: Award, title: "20+ Years", sub: "Of dedicated service" },
              { icon: HeartHandshake, title: "5,000+", sub: "Families guided" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="glass-card p-5">
                <Icon size={20} style={{ color: "var(--saffron)" }} />
                <p className="mt-3 font-display text-xl">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default About;
