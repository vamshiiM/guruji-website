import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--gold)_30%,transparent)] px-3 py-1.5 text-xs font-medium hover:bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] transition"
        title={t("language")}
        aria-label={t("language")}
      >
        <Languages size={14} />
        {compact ? current.short : current.label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[color-mix(in_oklab,var(--gold)_25%,transparent)] bg-background/95 backdrop-blur shadow-xl z-50 overflow-hidden">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code);
                try { localStorage.setItem("divya_lang", l.code); } catch {}
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] transition text-left"
            >
              <span>{l.label}</span>
              {i18n.language === l.code && <Check size={14} style={{ color: "var(--saffron)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
