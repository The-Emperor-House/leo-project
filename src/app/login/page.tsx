"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = (() => {
    const raw = searchParams.get("from");
    return raw?.startsWith("/") ? raw : "/admin";
  })();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    } else {
      window.location.href = from;
    }
  }

  return (
    <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-lg p-8">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border mb-4">
          <Image src="/logo.jpg" alt="LeoAngelo" fill className="object-cover" />
        </div>
        <h1 className="text-2xl font-semibold font-display">Admin Login</h1>
        <p className="text-sm text-muted-foreground mt-1">LeoAngelo Admin Panel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@leoangelo.co.th"
            className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gold-glow"
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 linen-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
