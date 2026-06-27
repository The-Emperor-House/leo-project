"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 linen-bg">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border mb-4">
            <Image src="/logo.jpg" alt="LeoAngelo" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">LeoAngelo Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@leoangelo.co.th"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
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
    </div>
  );
}
