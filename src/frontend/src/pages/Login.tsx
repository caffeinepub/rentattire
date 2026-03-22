import { useState } from "react";
import { useStore } from "../store/useStore";

interface LoginProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useStore();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (email !== "rekha26" || password !== "Klb37319c)") {
      setError("Access denied. Invalid credentials.");
      return;
    }
    login({
      id: "admin-1",
      name: "rekha26",
      email: "rekha26",
      phone: "",
      role: "admin",
    });
    onNavigate("admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img
            src="/assets/uploads/LOGO-1.jpeg"
            alt="Radhe Radhe Unique Collection"
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-sm text-muted-foreground font-sans-body">
            Admin Sign In
          </p>
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
          <div>
            <label
              htmlFor="login-email"
              className="block text-[10px] tracking-widest text-muted-foreground mb-2 font-sans-body"
            >
              USERNAME
            </label>
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-ocid="login.email_input"
              className="w-full border-b border-border bg-transparent py-3 text-sm font-sans-body outline-none focus:border-foreground transition-colors"
              placeholder="Username"
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
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          data-ocid="login.submit_button"
          className="w-full mt-8 bg-foreground text-background py-4 text-xs tracking-widest font-sans-body hover:bg-foreground/90 transition-colors"
        >
          SIGN IN AS ADMIN
        </button>
      </div>
    </div>
  );
}
