import { useEffect, useState } from "react";

const THEME_KEY = "divya-seva-theme";
const THEMES = ["light", "dark", "sepia"];

export function getInitialTheme() {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && THEMES.includes(stored)) return stored;
    return "light";
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark", "sepia");
        if (theme === "dark") root.classList.add("dark");
        else if (theme === "sepia") root.classList.add("sepia");
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
