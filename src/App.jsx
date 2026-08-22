import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { applyPersistedLanguage } from "@/lib/i18n";

// Home loads eagerly (it's the landing page). Every other route is code-split
// so its JS — most importantly the large admin dashboard — isn't downloaded
// until that route is actually visited.
import Home from "@/pages/Home";
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Booking = lazy(() => import("@/pages/Booking"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Profile = lazy(() => import("@/pages/Profile"));
const Admin = lazy(() => import("@/pages/Admin"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );
}

function NotFound() {
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

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    applyPersistedLanguage();
  }, []);

  return (
    <AuthProvider>
      {isAdmin ? (
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      ) : (
        <>
          <Header />
          <main className="pt-16">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
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
  );
}
