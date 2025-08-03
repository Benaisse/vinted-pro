"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { signUp, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (user) router.replace("/inventaire");
  }, [user, router]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    if (!isEmailValid || !isPasswordValid) return;
    setIsSubmitting(true);
    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du compte");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 -z-10" />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] -z-10" />
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-2 animate-fade-in">
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-4 shadow-2xl flex items-center justify-center border-4 border-white/30 backdrop-blur-xl relative">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="white" />
              <text x="50%" y="56%" textAnchor="middle" fill="#7c3aed" fontSize="32" fontWeight="bold" dy=".3em" fontFamily="Arial, sans-serif">VP</text>
            </svg>
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/10 blur-2xl opacity-60 pointer-events-none" />
          </div>
          <span className="font-extrabold text-3xl mt-4 tracking-wide font-sans text-white drop-shadow-[0_2px_8px_rgba(80,0,120,0.18)]">Vinted Pro</span>
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur-2xl border-2 border-transparent bg-clip-padding shadow-2xl p-8 sm:p-10 w-full relative overflow-hidden group transition-all duration-300">
          <div className="absolute -inset-0.5 rounded-2xl pointer-events-none group-hover:blur-[2px] group-hover:opacity-80 opacity-60 z-0 bg-gradient-to-br from-indigo-400/40 via-purple-400/30 to-pink-400/20" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight font-sans">Créer un compte</h1>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className={`peer w-full bg-white/90 border-2 rounded-lg px-12 py-3 text-base font-medium text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm ${touched.email && !isEmailValid ? 'border-red-400 ring-2 ring-red-300' : 'border-slate-200'} ${touched.email && isEmailValid ? 'border-green-400 ring-2 ring-green-200' : ''}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="Votre email"
                  required
                  autoFocus
                  aria-invalid={touched.email && !isEmailValid}
                  aria-describedby="email-error"
                />
                <label htmlFor="email" className="absolute left-12 top-3 text-slate-500 text-base font-normal pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-indigo-500 peer-focus:font-semibold peer-focus:bg-white/80 px-1 rounded">
                  Email
                </label>
                <Mail className="absolute left-4 top-3 w-5 h-5 text-indigo-400 pointer-events-none" />
                {touched.email && !isEmailValid && (
                  <div id="email-error" className="text-xs text-red-500 mt-1 animate-fade-in">Adresse email invalide</div>
                )}
                {touched.email && isEmailValid && (
                  <div className="text-xs text-green-500 mt-1 animate-fade-in">Adresse valide</div>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`peer w-full bg-white/90 border-2 rounded-lg px-12 py-3 text-base font-medium text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300 shadow-sm ${touched.password && !isPasswordValid ? 'border-red-400 ring-2 ring-red-300' : 'border-slate-200'} ${touched.password && isPasswordValid ? 'border-green-400 ring-2 ring-green-200' : ''}`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder="Votre mot de passe"
                  required
                  minLength={6}
                  aria-invalid={touched.password && !isPasswordValid}
                  aria-describedby="password-error"
                />
                <label htmlFor="password" className="absolute left-12 top-3 text-slate-500 text-base font-normal pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-sm peer-focus:text-indigo-500 peer-focus:font-semibold peer-focus:bg-white/80 px-1 rounded">
                  Mot de passe
                </label>
                <Lock className="absolute left-4 top-3 w-5 h-5 text-indigo-400 pointer-events-none" />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-3 text-slate-400 hover:text-indigo-500 transition-colors"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {touched.password && !isPasswordValid && (
                  <div id="password-error" className="text-xs text-red-500 mt-1 animate-fade-in">6 caractères minimum</div>
                )}
                {touched.password && isPasswordValid && (
                  <div className="text-xs text-green-500 mt-1 animate-fade-in">Mot de passe valide</div>
                )}
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2 animate-fade-in shadow-sm">{error}</div>
              )}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-2 animate-fade-in shadow-sm">Compte créé ! Redirection...</div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] text-lg"
                disabled={isSubmitting || loading || !isEmailValid || !isPasswordValid}
              >
                {isSubmitting || loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSubmitting || loading ? "Création..." : "Créer un compte"}
              </button>
            </form>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm gap-2">
              <span className="text-slate-500">Déjà un compte ? <Link href="/login" className="text-indigo-500 hover:underline transition-colors">Se connecter</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 