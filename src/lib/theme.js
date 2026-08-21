import { useEffect, useState } from "react";

const THEME_KEY = "divya-seva-theme";
const THEMES = ["white", "dark"];

export function getInitialTheme() {
    if (typeof window === "undefined") return "white";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.includes(stored)) return stored;
    return "white";
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        // "white" is the base :root theme (no class); only "dark" adds a class.
        // Legacy classes are cleared so stale values never linger.
        root.classList.remove("dark", "sepia", "white");
        if (theme === "dark") root.classList.add("dark");
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const cycleTheme = () => {
        setTheme((prev) => {
            const idx = THEMES.indexOf(prev);
            return THEMES[(idx + 1) % THEMES.length];
        });
    };

    return { theme, setTheme, cycleTheme };
}
