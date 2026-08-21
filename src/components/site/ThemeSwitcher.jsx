import { useTheme } from "@/lib/theme";
import { Moon, Feather } from "lucide-react";
import { motion } from "framer-motion";

const icons = {
    white: Feather,
    dark: Moon,
};

const labels = {
    white: "Pure White",
    dark: "Sacred Night",
};

export function ThemeSwitcher({ compact }) {
    const { theme, cycleTheme } = useTheme();
    const Icon = icons[theme];

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={cycleTheme}
            className={`inline-flex items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--background)_70%,transparent)] backdrop-blur text-foreground/80 hover:text-foreground transition-colors ${compact ? "h-8 w-8" : "h-9 w-9"}`}
            title={labels[theme]}
            aria-label={`Theme: ${labels[theme]}`}
        >
            <Icon size={compact ? 16 : 18} />
        </motion.button>
    );
}
