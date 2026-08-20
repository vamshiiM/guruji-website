import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flame, Sparkles, CalendarCheck, ArrowRight, Star, Quote, Sunrise, Moon, Sun, Flower2, ScrollText, HandHeart } from "lucide-react";
import pujaImg from "@/assets/puja-hands.jpg";
import bellImg from "@/assets/temple-bell.jpg";
import templeInteriorImg from "@/assets/temple-interior.jpg";
import { Reveal } from "@/components/site/Reveal";



const shlokas = [
  "ॐ भूर्भुवः स्वः",
  "सर्वे भवन्तु सुखिनः",
  "वसुधैव कुटुम्बकम्",
  "सत्यमेव जयते",
  "ॐ शान्ति शान्ति शान्तिः",
];

function Home() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 160]);
  const y2 = useTransform(scrollY, [0, 800], [0, -200]);
  const heroContentY = useTransform(scrollY, [0, 700], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);
  const orb1Y = useTransform(scrollY, [0, 1000], [0, -250]);
  const orb2Y = useTransform(scrollY, [0, 1000], [0, 180]);
  const orb3Y = useTransform(scrollY, [0, 1000], [0, -120]);
  const pujaImgY = useTransform(scrollY, [800, 2200], [-60, 60]);
  const bellY = useTransform(scrollY, [1400, 2600], [-100, 100]);
  const templeY = useTransform(scrollY, [600, 2000], [-40, 40]);

  // cursor-following divine glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const onMove = (e) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);

  const [shlokaIdx, setShlokaIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShlokaIdx((i) => (i + 1) % shlokas.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[94vh] overflow-hidden flex items-center">
        {/* cursor glow */}
        <motion.div
          aria-hidden
          className="absolute h-[480px] w-[480px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            left: glowX, top: glowY, x: "-50%", y: "-50%",
            background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)",
          }}
        />

        {/* Floating orbs with parallax */}
        <motion.div style={{ y: orb1Y }} className="absolute inset-0 -z-10 pointer-events-none">
          <Orb className="top-[14%] left-[6%] h-64 w-64" colorA="var(--saffron)" colorB="transparent" delay={0} />
        </motion.div>
        <motion.div style={{ y: orb2Y }} className="absolute inset-0 -z-10 pointer-events-none">
          <Orb className="bottom-[10%] left-[40%] h-40 w-40" colorA="var(--gold)" colorB="transparent" delay={1.2} />
        </motion.div>
        <motion.div style={{ y: orb3Y }} className="absolute inset-0 -z-10 pointer-events-none">
          <Orb className="top-[18%] right-[8%] h-52 w-52" colorA="var(--gold)" colorB="transparent" delay={2.4} />
        </motion.div>

        {/* Rotating mandala */}
        <motion.div
          aria-hidden
          style={{ y: y2 }}
          className="absolute top-1/2 right-[-200px] -translate-y-1/2 hidden md:block -z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="h-[560px] w-[560px] rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--gold) 40%, transparent), transparent 25%, color-mix(in oklab, var(--saffron) 35%, transparent), transparent 50%, color-mix(in oklab, var(--gold) 25%, transparent), transparent 75%)",
              mask: "radial-gradient(circle, transparent 56%, black 58%, black 60%, transparent 62%), radial-gradient(circle, transparent 66%, black 68%, black 69%, transparent 70%)",
              WebkitMask: "radial-gradient(circle, transparent 56%, black 58%, black 60%, transparent 62%), radial-gradient(circle, transparent 66%, black 68%, black 69%, transparent 70%)",
              maskComposite: "add",
              WebkitMaskComposite: "source-over",
            }}
          />
        </motion.div>

        {/* Faint Om */}
        <motion.div
          style={{ y: y1 }}
          animate={{ opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute right-[14%] top-[28%] font-display text-[14rem] leading-none select-none -z-10 hidden lg:block"
        >
          <span style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))", WebkitBackgroundClip: "text", color: "transparent" }}>ॐ</span>
        </motion.div>

        <motion.div style={{ y: heroContentY, opacity: heroOpacity }} className="mx-auto max-w-7xl px-6 w-full relative grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="eyebrow inline-flex items-center gap-2"
            >
              <span className="h-px w-8" style={{ background: "var(--saffron)" }} />
              {t("home.eyebrow")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
              className="mt-5 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-balance"
            >
              {t("home.h1a")}{" "}
              <em className="not-italic relative inline-block" style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))", WebkitBackgroundClip: "text", color: "transparent" }}>
                {t("home.h1b")}
                <motion.svg
                  viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 1.2 }}
                >
                  <motion.path d="M2 8 Q 50 2, 100 6 T 198 5" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                </motion.svg>
              </em>{t("home.h1c")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
              className="mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              {t("home.sub")}
            </motion.p>

            {/* Live shloka ticker */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-6 inline-flex items-center gap-3 rounded-full px-4 py-2 border"
              style={{ borderColor: "color-mix(in oklab, var(--gold) 30%, transparent)", background: "color-mix(in oklab, var(--card) 60%, transparent)", backdropFilter: "blur(8px)" }}
            >
              <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ color: "var(--saffron)" }}>
                <Flower2 size={14} />
              </motion.span>
              <div className="overflow-hidden h-5 w-44">
                <motion.div
                  animate={{ y: -shlokaIdx * 20 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="flex flex-col"
                >
                  {shlokas.map((s) => (
                    <span key={s} className="h-5 text-sm font-display tracking-wide" style={{ color: "var(--ink)" }}>{s}</span>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.9 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/booking" className="btn-primary"><CalendarCheck size={18} /> {t("common.bookPuja")} <ArrowRight size={16} /></Link>
              <Link to="/services" className="btn-ghost">{t("common.viewServices")}</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm text-muted-foreground"
            >
              <Stat n="20+" label={t("home.stats.years")} />
              <Stat n="5,000+" label={t("home.stats.families")} />
              <Stat n="40+" label={t("home.stats.rituals")} />
            </motion.div>
          </div>

          {/* Today's Tithi card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.9 }}
            className="relative hidden lg:block"
          >
            <TithiCard />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>{t("home.scroll")}</motion.div>
        </motion.div>
      </section>

      {/* SACRED MARQUEE */}
      <section className="relative py-10 border-y overflow-hidden w-full" style={{ borderColor: "color-mix(in oklab, var(--gold) 20%, transparent)", background: "color-mix(in oklab, var(--card) 40%, transparent)" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap font-display text-2xl md:text-3xl"
          style={{ color: "color-mix(in oklab, var(--ink) 60%, transparent)" }}
        >
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex gap-16">
              {["Griha Pravesh", "ॐ", "Satyanarayan Katha", "✦", "Vedic Wedding", "ॐ", "Navagraha Shanti", "✦", "Rudrabhishek", "ॐ", "Mundan Sanskar", "✦"].map((w, i) => (
                <span key={i} className="inline-flex items-center gap-16">{w}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* TEMPLE INTERIOR — subtle parallax atmosphere */}
      <section className="relative h-[50vh] overflow-hidden my-8 flex items-center justify-center">
        <motion.div style={{ y: templeY }} className="absolute inset-0 -z-10">
          <img src={templeInteriorImg} alt="Serene temple interior" loading="lazy" width={1920} height={1080} className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "color-mix(in oklab, var(--background) 65%, transparent)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, var(--background) 85%)" }} />
        </motion.div>
        <Reveal>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="text-center"
          >
            <p className="font-display text-4xl md:text-6xl leading-tight select-none" style={{ color: "color-mix(in oklab, var(--gold) 25%, transparent)" }}>ॐ</p>
          </motion.div>
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <motion.img style={{ y: pujaImgY, scale: 1.18 }} src={pujaImg} alt="Puja ritual" loading="lazy" className="w-full aspect-[4/5] object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-card absolute -bottom-8 -right-6 p-5 max-w-[220px]"
            >
              <Flame style={{ color: "var(--saffron)" }} size={22} />
              <p className="mt-2 font-display text-xl leading-tight">Light. Mantra. Intention.</p>
            </motion.div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <span className="eyebrow">{t("home.philosophy.eyebrow")}</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">{t("home.philosophy.title")}</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {t("home.philosophy.body")}
          </p>
          <Link to="/about" className="btn-ghost mt-8 inline-flex">{t("common.readStory")} <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="eyebrow">{t("home.services.eyebrow")}</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">{t("home.services.title")}</h2>
            </div>
            <Link to="/services" className="text-sm hover:underline underline-offset-4 inline-flex items-center gap-1">
              {t("common.allServices")} <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {servicesPreview.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="glass-card p-7 h-full group relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }} />
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
                  <s.icon size={20} className="text-white" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <p className="mt-5 text-xs uppercase tracking-widest" style={{ color: "var(--saffron)" }}>From ₹{s.price}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RITUAL JOURNEY — creative timeline */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">{t("home.journey.eyebrow")}</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">{t("home.journey.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("home.journey.sub")}</p>
          </div>
        </Reveal>
        <div className="mt-16 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: "linear-gradient(180deg, transparent, var(--gold), transparent)" }} />
          {journey.map((j, i) => (
            <Reveal key={j.title} delay={i * 0.1}>
              <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-12 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                <div className="md:[direction:ltr] relative">
                  <div className="glass-card p-7">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
                        <j.icon size={18} className="text-white" />
                      </div>
                      <span className="font-display text-sm tracking-widest uppercase" style={{ color: "var(--saffron)" }}>Step 0{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl">{j.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{j.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex justify-center">
                  <motion.div
                    whileInView={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="h-4 w-4 rounded-full ring-4" style={{ background: "var(--saffron)", boxShadow: "0 0 30px var(--gold)", ringColor: "var(--background)" }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PARALLAX QUOTE */}
      <section className="relative h-[60vh] overflow-hidden my-24 flex items-center">
        <motion.div style={{ y: bellY }} className="absolute inset-0 -z-10">
          <img src={bellImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "color-mix(in oklab, var(--background) 75%, transparent)" }} />
        </motion.div>
        <Reveal className="mx-auto max-w-4xl px-6 text-center">
          <Quote className="mx-auto mb-6" style={{ color: "var(--saffron)" }} size={32} />
          <p className="font-display text-3xl md:text-5xl leading-snug text-balance">
            "Yatra yogeshvarah krishno, yatra partho dhanur-dharah —<br />
            tatra shrir vijayo bhutir, dhruva nitir matir mama."
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-muted-foreground">Bhagavad Gita 18.78</p>
        </Reveal>
      </section>

      {/* TESTIMONIALS — infinite scrolling marquee */}
      <section className="py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <span className="eyebrow">Kind words</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Blessings from our families</h2>
          </Reveal>
        </div>

        <div className="mt-12 relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, var(--background), transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, var(--background), transparent)" }} />

          <motion.div
            className="flex gap-6 w-max cursor-pointer"
            animate={{ x: [0, -50 * testimonials.length * 3.2] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {/* Triple the testimonials for seamless infinite scroll */}
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                className="glass-card p-7 w-[340px] md:w-[400px] shrink-0 select-none"
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <div className="flex gap-0.5" style={{ color: "var(--gold)" }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.06, duration: 0.3 }}
                    >
                      <Star size={14} fill="currentColor" />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <motion.div
                    className="h-9 w-9 rounded-full flex items-center justify-center font-display text-sm text-white"
                    style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    {t.name.charAt(0)}
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] -z-10"
        >
          {/* Central divine glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--gold) 40%, transparent), transparent 70%)",
              filter: "blur(24px)",
            }}
          />

          {/* Floating energy orbs */}
          <EnergyOrb size={6} x={-180} y={-160} color="var(--gold)" duration={14} delay={0} />
          <EnergyOrb size={4} x={160} y={-140} color="var(--saffron)" duration={18} delay={1.5} />
          <EnergyOrb size={5} x={-140} y={140} color="var(--gold)" duration={16} delay={3} />
          <EnergyOrb size={3} x={180} y={120} color="var(--saffron)" duration={20} delay={0.8} />
          <EnergyOrb size={4} x={0} y={-200} color="var(--gold)" duration={12} delay={2.2} />
          <EnergyOrb size={3} x={-200} y={40} color="var(--saffron)" duration={22} delay={4} />
          <EnergyOrb size={5} x={200} y={-40} color="var(--gold)" duration={15} delay={1} />
          <EnergyOrb size={3} x={80} y={180} color="var(--saffron)" duration={19} delay={2.8} />
          <EnergyOrb size={4} x={-80} y={190} color="var(--gold)" duration={17} delay={3.5} />

          {/* Wisp trails */}
          <Wisp x={-120} y={-100} color="var(--gold)" duration={10} delay={0} />
          <Wisp x={120} y={80} color="var(--saffron)" duration={12} delay={2} />
          <Wisp x={-80} y={120} color="var(--gold)" duration={9} delay={4} />
          <Wisp x={100} y={-120} color="var(--saffron)" duration={11} delay={1.5} />

          {/* Radial divine rays */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full opacity-10"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, var(--gold), transparent 15%, var(--saffron), transparent 30%, var(--gold), transparent 50%, var(--saffron), transparent 65%, var(--gold), transparent 80%)",
              filter: "blur(2px)",
            }}
          />
        </div>
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl text-balance">Ready to invite the divine?</h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Share your occasion with us and we'll arrange a ceremony that honors your tradition with grace.
          </p>
          <Link to="/booking" className="btn-primary mt-8 inline-flex">Book your ceremony <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

    </>
  );
}

function TithiCard() {
  const [date, setDate] = useState("");
  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }));
  }, []);
  return (
    <div className="glass-card p-7 relative overflow-hidden">
      <motion.div
        aria-hidden animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full opacity-20"
        style={{ background: "conic-gradient(from 0deg, var(--gold), transparent, var(--saffron), transparent)" }}
      />
      <div className="flex items-center justify-between">
        <span className="eyebrow">Today's Panchang</span>
        <Sparkles size={16} style={{ color: "var(--saffron)" }} />
      </div>
      <p className="mt-3 font-display text-2xl">{date || "Loading..."}</p>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <Muhurta icon={Sunrise} label="Sunrise" value="6:12" />
        <Muhurta icon={Sun} label="Abhijit" value="11:48" />
        <Muhurta icon={Moon} label="Sunset" value="18:34" />
      </div>
      <div className="mt-6 pt-5 border-t" style={{ borderColor: "color-mix(in oklab, var(--gold) 25%, transparent)" }}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Auspicious for</p>
        <p className="mt-2 font-display text-lg">Griha Pravesh · Satyanarayan</p>
      </div>
    </div>
  );
}

function Muhurta({ icon: Icon, label, value }) {
  return (
    <div>
      <Icon size={16} className="mx-auto" style={{ color: "var(--saffron)" }} />
      <p className="mt-2 font-display text-lg">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Orb({ className, colorA, colorB, delay = 0 }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.3, 0.55, 0.3],
        scale: [1, 1.12, 1],
        x: [0, 24, -16, 0],
        y: [0, -20, 12, 0],
      }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute rounded-full -z-10 blur-3xl pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${colorA}, ${colorB} 70%)`,
      }}
    />
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-display text-3xl" style={{ color: "var(--saffron)" }}>{n}</div>
      <div className="text-xs uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function EnergyOrb({ size, x, y, color, duration, delay }) {
  return (
    <motion.div
      aria-hidden
      animate={{
        y: [y, y - 30, y + 20, y - 10, y],
        x: [x, x + 20, x - 15, x + 10, x],
        opacity: [0.2, 0.7, 0.5, 0.8, 0.2],
        scale: [1, 1.3, 0.9, 1.2, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: `blur(${size}px)`,
        boxShadow: `0 0 ${size * 6}px ${size}px color-mix(in oklab, ${color} 40%, transparent)`,
      }}
    />
  );
}

function Wisp({ x, y, color, duration, delay }) {
  return (
    <motion.div
      aria-hidden
      animate={{
        y: [y, y - 60, y + 40, y],
        x: [x, x + 30, x - 20, x],
        opacity: [0, 0.4, 0.2, 0],
        scale: [0.6, 1.2, 0.8, 0.5],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: "80px",
        height: "80px",
        background: `radial-gradient(ellipse at center, color-mix(in oklab, ${color} 25%, transparent), transparent 70%)`,
        filter: "blur(12px)",
      }}
    />
  );
}

const servicesPreview = [
  { title: "Griha Pravesh", desc: "Sacred housewarming ritual to invoke prosperity and protection over a new home.", price: "5,100", icon: Flame },
  { title: "Satyanarayan Katha", desc: "Monthly puja and recitation honoring Lord Vishnu, performed with full vidhi.", price: "3,100", icon: Sparkles },
  { title: "Vedic Wedding", desc: "Complete sapt-padi and saat-pheras ceremony as per regional Vedic traditions.", price: "21,000", icon: Star },
];

const journey = [
  { title: "Sankalpa — The Intention", desc: "We begin by understanding your occasion, family tradition, and the blessings you seek.", icon: HandHeart },
  { title: "Tithi — The Right Moment", desc: "Pandit Ji selects the most auspicious muhurta aligned with your stars and the lunar calendar.", icon: Moon },
  { title: "Vidhi — The Ceremony", desc: "Mantras, fire, flowers and offerings performed with strict Vedic adherence and clear translation.", icon: ScrollText },
  { title: "Aashirvaad — The Blessing", desc: "The ceremony closes with prasad, blessings, and guidance for nurturing the energy at home.", icon: Flower2 },
];

const testimonials = [
  { name: "Ananya Sharma", role: "Griha Pravesh, Mumbai", quote: "Pandit Ji explained every step with such patience. Our new home truly felt blessed by the end of the ceremony." },
  { name: "Rohan & Priya", role: "Wedding, Jaipur", quote: "Calm, precise and deeply moving. Our families are still talking about the beauty of the rituals he led." },
  { name: "Meera Iyer", role: "Satyanarayan Puja", quote: "I've booked Pandit Ji every month for two years. Always punctual, always pure-hearted." },
  { name: "Vikram Patel", role: "Navagraha Shanti, Ahmedabad", quote: "The chanting was so powerful — you could feel the energy shift in the room. Highly recommended." },
  { name: "Sunita Devi", role: "Mundan Sanskar, Delhi", quote: "Everything was arranged flawlessly. The family felt at peace throughout the entire ceremony." },
  { name: "Arjun Reddy", role: "Rudrabhishek, Hyderabad", quote: "The abhishekam was performed with such devotion. It was a truly transformative experience for all of us." },
];

export default Home;
