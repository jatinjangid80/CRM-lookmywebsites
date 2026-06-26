import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Plane, Lock, User, Shield, UserCheck, AlertCircle } from "lucide-react";
import { login, getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "../assets/lookmyholidays.jpeg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"admin" | "employee">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dynamicHints, setDynamicHints] = useState<{ label: string; username: string; password: string }[]>([]);

  const loadDynamicHints = () => {
    try {
      const raw = localStorage.getItem("crm_employees_v3");
      if (raw) {
        const list = JSON.parse(raw);
        const hints = list
          .filter((emp: any) => emp.username && emp.password)
          .map((emp: any) => ({
            label: emp.name,
            username: emp.username,
            password: emp.password,
          }));
        setDynamicHints(hints);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDynamicHints();
    // Also listen for storage changes from other tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === "crm_employees_v3") loadDynamicHints();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Reload hints whenever the role tab switches
  useEffect(() => {
    loadDynamicHints();
  }, [role]);

  // Already logged in → go to CRM
  useEffect(() => {
    if (getAuth()) navigate({ to: "/crm" });
  }, [navigate]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = login(username, password);
      if (!user) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }
      if (user.role !== role) {
        setError(
          role === "admin"
            ? "This account is an Employee account. Please select Employee role."
            : "This account is an Admin account. Please select Admin role."
        );
        setLoading(false);
        return;
      }
      navigate({ to: "/crm" });
    }, 600); // small delay for UX
  }

  const hintUsers =
    role === "admin"
      ? [{ label: "Admin (Manvendra Singhal)", username: "admin", password: "admin123" }]
      : dynamicHints.length > 0
        ? dynamicHints
        : [
            { label: "Nikita Bairwa", username: "nikita", password: "emp123" },
            { label: "Pushplata Kriplani", username: "pushplata", password: "emp123" },
            { label: "AMAN SHARMA", username: "aman", password: "emp123" },
            { label: "Deepak Kumar", username: "deepak", password: "emp123" },
          ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 text-white"
        style={{ background: "var(--gradient-brand)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="LookMyHolidays" className="h-12 w-auto rounded-xl mix-blend-multiply" />
        </div>

        {/* Center copy */}
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-extrabold leading-tight">
            Grand Journeys<br />
            <span className="opacity-75">CRM Portal</span>
          </h1>
          <p className="max-w-md text-lg opacity-85">
            Manage leads, bookings, visa applications, tasks, and your team — all in one place.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              "Lead Management",
              "Task Assignment",
              "Visa Tracking",
              "Employee Portal",
              "Analytics",
              "Folders",
            ].map((f) => (
              <span
                key={f}
                className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-6 border-t border-white/20 pt-8">
          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "10k+", l: "Happy Travellers" },
              { n: "5k+", l: "Tours Completed" },
              { n: "100+", l: "Destinations" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl font-extrabold">{s.n}</p>
                <p className="mt-1 text-xs opacity-75">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="text-sm font-medium text-white/80">
            Created by <span className="font-bold text-white">jatin jangid</span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <img src={logoImg} alt="LookMyHolidays" className="h-10 w-auto rounded-xl mix-blend-multiply" />
        </div>

        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your CRM account to continue.
          </p>

          {/* Role Selector */}
          <div className="mt-8 flex rounded-2xl border border-border bg-secondary/40 p-1">
            <button
              type="button"
              onClick={() => { setRole("admin"); setError(""); setUsername(""); setPassword(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                role === "admin"
                  ? "bg-card shadow-md text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4 text-primary" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setRole("employee"); setError(""); setUsername(""); setPassword(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                role === "employee"
                  ? "bg-card shadow-md text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4 text-primary" />
              Employee
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-username"
                  placeholder={role === "admin" ? "admin" : "e.g. riya"}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="pl-9 rounded-xl"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="pl-9 pr-10 rounded-xl"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              id="login-submit-btn"
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="mt-2 w-full gap-2 rounded-xl py-5 text-sm font-semibold"
              style={{ background: "var(--gradient-brand)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Hint credentials */}
          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {role === "employee" ? "Employee Credentials" : "Admin Credentials"}
              </p>
              <button
                type="button"
                onClick={loadDynamicHints}
                className="text-[10px] text-primary font-semibold hover:underline"
              >
                ↻ Refresh
              </button>
            </div>
            <div className="space-y-2">
              {hintUsers.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No employee credentials set yet. Go to an employee profile → "Set Login Credentials".
                </p>
              ) : (
                hintUsers.map((u) => (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => { setUsername(u.username); setPassword(u.password); setError(""); }}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-xs hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="font-semibold">{u.label}</span>
                    <span className="text-muted-foreground font-mono">
                      {u.username} / {u.password}
                    </span>
                  </button>
                ))
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Click any row to auto-fill credentials.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
