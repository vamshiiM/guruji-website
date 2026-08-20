import { QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    createRootRouteWithContext,
    useRouter,
    useRouterState,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import "@/lib/i18n";
import { applyPersistedLanguage } from "@/lib/i18n";
import { getInitialTheme } from "@/lib/theme";

function NotFoundComponent() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="max-w-md text-center">
                <h1 className="font-display text-8xl">404</h1>
                <p className="mt-3 text-muted-foreground">This path doesn't lead anywhere sacred.</p>
                <a href="/" className="btn-primary mt-6 inline-flex">Return home</a>
            </div>
        </div>
    );
}

function ErrorComponent({ error, reset }) {
    const router = useRouter();
    useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="max-w-md text-center">
                <h1 className="font-display text-3xl">Something went wrong</h1>
                <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
                <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary mt-6">Try again</button>
            </div>
        </div>
    );
}

export const Route = createRootRouteWithContext()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Divya Seva — Vedic Rituals & Puja Services" },
            { name: "description", content: "Book authentic Vedic pujas and ceremonies performed by an experienced pandit with devotion, precision, and divine grace." },
        ],
        links: [
            { rel: "stylesheet", href: appCss },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" },
        ],
        scripts: [
            {
                children: `(function(){try{var t=localStorage.getItem('divya-seva-theme');if(t==='dark'){document.documentElement.classList.add('dark');}else if(t==='sepia'){document.documentElement.classList.add('sepia');}}catch(e){}})();`,
            },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }) {
    return (
        <html lang="en">
            <head><HeadContent /></head>
            <body>{children}<Scripts /></body>
        </html>
    );
}

function RootComponent() {
    const { queryClient } = Route.useRouteContext();
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const isAdmin = pathname.startsWith("/admin");
    useEffect(() => { applyPersistedLanguage(); }, []);
    useEffect(() => {
        const root = document.documentElement;
        const theme = getInitialTheme();
        root.classList.remove("dark", "sepia");
        if (theme === "dark") root.classList.add("dark");
        else if (theme === "sepia") root.classList.add("sepia");
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {isAdmin ? (
                    <Outlet />
                ) : (
                    <>
                        <Header />
                        <main className="pt-16"><Outlet /></main>
                        <Footer />
                    </>
                )}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "oklch(0.21 0.02 50)",
                            color: "oklch(0.99 0.005 80)",
                            border: "1px solid color-mix(in oklab, oklch(0.78 0.13 80) 30%, transparent)",
                            borderRadius: "9999px",
                            padding: "10px 18px",
                            fontSize: "14px",
                        },
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    );
}
