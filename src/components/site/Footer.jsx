import { Flame, Phone, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-32 border-t border-[color-mix(in_oklab,var(--gold)_25%,transparent)]">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
              <Flame size={18} className="text-white" />
            </span>
            <span className="font-display text-xl">Divya Seva</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">{t("footer.links.about")}</Link></li>
            <li><Link to="/services">{t("footer.links.services")}</Link></li>
            <li><Link to="/booking">{t("footer.links.booking")}</Link></li>
            <li><Link to="/contact">{t("footer.links.contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">{t("footer.connect")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={14} /><span>+91 7498293339</span></li>
            <li className="flex items-center gap-2"><Mail size={14} /><span></span></li>
            <li className="flex items-center gap-2"><MapPin size={14} /><span>Worli_koliwada,Mumbai,India</span></li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()} Shivarpanastro.com</p>
        </div>
      </div>
    </footer>
  );
}
