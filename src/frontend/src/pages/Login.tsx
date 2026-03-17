import { useState } from "react";
import { useStore } from "../store/useStore";

interface LoginProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { login } = useStore();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    login({
      id: "user-1",
      name: email.split("@")[0] || "User",
      email,
      phone: "",
      role: email.includes("admin") ? "admin" : "user",
    });
    onNavigate("home");
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    login({ id: `user-${Date.now()}`, name, email, phone, role: "user" });
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-display text-4xl mb-2">RentAttire</p>
          <p className="text-sm text-muted-foreground font-sans-body">
            {tab === "login"
              ? "Sign in to your account"
              : "Create a new account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
            }}
            data-ocid="login.login_tab"
            className={`flex-1 pb-3 text-xs tracking-widest font-sans-body transition-colors border-b-2 -mb-px ${
              tab === "login"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError("");
            }}
            data-ocid="login.signup_tab"
            className={`flex-1 pb-3 text-xs tracking-widest font-sans-body transition-colors border-b-2 -mb-px ${
              tab === "signup"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {error && (
          <div
            data-ocid="login.error_state"
            className="border border-destructive/30 bg-destructive/5 text-destructive text-sm p-3 mb-6 font-sans-body"
          >
            {error}
          </div>
        )}

        <div className="space-y-5">
          {tab === "signup" && (
            <div>
              <label
                htmlFor="login-name"
                className="block text-[10px] tracking-widest text-muted-foreground mb-2 font-sans-body"
              >
                FULL NAME
              </label>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="login.name_input"
                className="w-full border-b border-border bg-transparent py-3 text-sm font-sans-body outline-none focus:border-foreground transition-colors"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="login-email"
              className="block text-[10px] tracking-widest text-muted-foreground mb-2 font-sans-body"
            >
              EMAIL
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-ocid="login.email_input"
              className="w-full border-b border-border bg-transparent py-3 text-sm font-sans-body outline-none focus:border-foreground transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-[10px] tracking-widest text-muted-foreground mb-2 font-sans-body"
            >
              PASSWORD
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-ocid="login.password_input"
              className="w-full border-b border-border bg-transparent py-3 text-sm font-sans-body outline-none focus:border-foreground transition-colors"
              placeholder="••••••••"
            />
          </div>
          {tab === "signup" && (
            <div>
              <label
                htmlFor="login-phone"
                className="block text-[10px] tracking-widest text-muted-foreground mb-2 font-sans-body"
              >
                PHONE (OPTIONAL)
              </label>
              <input
                id="login-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-ocid="login.phone_input"
                className="w-full border-b border-border bg-transparent py-3 text-sm font-sans-body outline-none focus:border-foreground transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={tab === "login" ? handleLogin : handleSignup}
          data-ocid="login.submit_button"
          className="w-full mt-8 bg-foreground text-background py-4 text-xs tracking-widest font-sans-body hover:bg-foreground/90 transition-colors"
        >
          {tab === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>

        {tab === "login" && (
          <p className="text-center text-xs text-muted-foreground mt-6 font-sans-body">
            Admin access: use any email with &quot;admin&quot; and any password.
          </p>
        )}
      </div>
    </div>
  );
}
