import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X, LogOut, User as UserIcon, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import toast from "react-hot-toast";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    { to: "/booking", label: t("nav.book") },
    { to: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      // Coalesce scroll events to one state check per animation frame.
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    };
    setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[color-mix(in_oklab,var(--background)_85%,transparent)] backdrop-blur-md border-b border-[color-mix(in_oklab,var(--gold)_25%,transparent)]"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}
          >
            <Flame size={18} />
          </motion.span>
          <span className="font-display text-xl tracking-wide">Divya Seva</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className="relative text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-px"
                    style={{ background: "var(--saffron)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <motion.a
            href="https://wa.me/919999999999?text=Namaste%20Guruji%2C%20I%20would%20like%20to%20book%20a%20ceremony."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            title={t("nav.whatsapp")}
          >
            <MessageCircle size={18} className="text-white" />
          </motion.a>
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <UserIcon size={14} /> {user.name}
              </Link>
              <button
                onClick={() => { logout(); toast.success("🙏"); }}
                className="btn-ghost text-sm !py-2 !px-4"
              >
                <LogOut size={14} /> {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm !py-2 !px-5">
              {t("nav.signIn")}
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher compact />
          <LanguageSwitcher compact />
          <button className="p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-[color-mix(in_oklab,var(--gold)_25%,transparent)] bg-background/95 backdrop-blur"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="py-2 text-foreground/80">{n.label}</Link>
              ))}
              <a
                href="https://wa.me/919999999999?text=Namaste%20Guruji%2C%20I%20would%20like%20to%20book%20a%20ceremony."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-foreground/80 inline-flex items-center gap-1.5"
              >
                <MessageCircle size={14} /> {t("nav.whatsapp")}
              </a>
              {user ? (
                <>
                  <Link to="/profile" className="py-2 text-foreground/80 inline-flex items-center gap-1.5">
                    <UserIcon size={14} /> {t("nav.profile")}
                  </Link>
                  <button onClick={() => { logout(); toast.success("🙏"); }} className="btn-ghost mt-2">
                    <LogOut size={14} /> {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary mt-2">{t("nav.signIn")}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
