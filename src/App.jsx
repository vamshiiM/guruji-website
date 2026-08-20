import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { applyPersistedLanguage } from "@/lib/i18n";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Booking from "@/pages/Booking";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

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
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        <>
          <Header />
          <main className="pt-16">
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
