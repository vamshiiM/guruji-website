import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { Flame, ArrowRight, Eye, EyeOff } from "lucide-react";



function LoginPage() {
  const { login, signup } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await login(form.email, form.password);
        toast.success(result.role === "admin" ? "Welcome, Guruji 🙏" : "Welcome back 🙏");
      } else {
        result = await signup(form.name, form.email, form.password);
        toast.success("Account created — welcome 🙏");
      }
      navigate(result.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      if (err?.code === "BAD_CREDENTIALS") toast.error("Invalid email or password");
      else if (err?.code === "RESERVED_EMAIL") toast.error("This email is reserved");
      else if (err?.code === "EMAIL_TAKEN") toast.error("An account with this email already exists");
      else if (err?.code === "RATE_LIMITED") toast.error("Too many attempts — please try again later");
      else if (err?.code === "VALIDATION") toast.error(err.message || "Please check your details");
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <Reveal>
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full mx-auto"
            style={{ background: "linear-gradient(135deg, var(--saffron), var(--gold))" }}>
            <Flame className="text-white" />
          </span>
          <h1 className="mt-6 font-display text-4xl">
            {mode === "login" ? t("login.welcome") : t("login.create")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "login" ? t("login.subLogin") : t("login.subSignup")}
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass-card mt-10 p-7 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-0 bottom-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                style={{ top: "0.5rem" }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
            {loading ? "Please wait..." : <>{mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={16} /></>}
          </button>
          <p className="text-center text-sm text-muted-foreground pt-2">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="underline underline-offset-4" style={{ color: "var(--saffron)" }}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </Reveal>
    </div>
  );
}

const inputCls = "mt-2 w-full bg-background/60 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition";

export default LoginPage;
