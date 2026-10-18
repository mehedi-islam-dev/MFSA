"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fish, Mail, Lock, User, Building2, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", institution: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const passwordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthColors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-teal-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (signUpError) {
        setError(signUpError.message ?? "Registration failed. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(0,212,170,0.1) 0%, rgba(2,12,24,1) 70%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 rounded-full opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, var(--color-teal-500), transparent)", top: "20%", right: "5%" }} />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, var(--color-teal-500), var(--color-ocean-400))" }}>
            <Fish className="w-8 h-8" style={{ color: "#020c18" }} />
          </div>
          <h1 className="text-3xl font-bold text-gradient-teal">Create Account</h1>
          <p className="text-[var(--color-ocean-200)] mt-2 text-sm">Join Marine Analytica — free forever</p>
        </div>

        <div className="glass-card p-8">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-[var(--color-teal-500)] mx-auto mb-4" />
              <p className="text-lg font-semibold text-white">Account created!</p>
              <p className="text-sm text-[var(--color-ocean-200)] mt-1">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.25)] text-[var(--color-coral-400)] text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-ocean-100)] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ocean-300)]" />
                  <input id="name" type="text" value={form.name} onChange={update("name")} placeholder="Dr. Jane Doe" required className="input-ocean pl-10" />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="reg-email" className="block text-sm font-medium text-[var(--color-ocean-100)] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ocean-300)]" />
                  <input id="reg-email" type="email" value={form.email} onChange={update("email")} placeholder="you@institution.edu" required className="input-ocean pl-10" />
                </div>
              </div>

              {/* Institution */}
              <div className="mb-4">
                <label htmlFor="institution" className="block text-sm font-medium text-[var(--color-ocean-100)] mb-1.5">Institution (optional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ocean-300)]" />
                  <input id="institution" type="text" value={form.institution} onChange={update("institution")} placeholder="University / Research Institute" className="input-ocean pl-10" />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="reg-password" className="block text-sm font-medium text-[var(--color-ocean-100)] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ocean-300)]" />
                  <input id="reg-password" type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Min. 8 characters" required className="input-ocean pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ocean-300)] hover:text-white" aria-label="Toggle password">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength ? strengthColors[strength] : "bg-[rgba(61,143,224,0.2)]")} />
                      ))}
                    </div>
                    <p className="text-[11px] text-[var(--color-ocean-300)]">Password strength: <span className="font-semibold">{strengthLabels[strength]}</span></p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isLoading} className={cn("btn-primary w-full justify-center", isLoading && "opacity-70 cursor-not-allowed")}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-5 text-sm text-[var(--color-ocean-300)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-teal-400)] hover:underline font-medium">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
