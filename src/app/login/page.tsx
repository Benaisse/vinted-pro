"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { signIn, user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  React.useEffect(() => {
    if (user) router.replace("/");
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
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setGoogleError(err.message || "Erreur Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Overlay blanc doux pour adoucir le fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 -z-10" />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] -z-10" />
      <div className="flex flex-col items-center w-full max-w-md mx-auto p-2 animate-fade-in">
        {/* Logo VP moderne glassmorphism */}
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
        {/* Card glassmorphism border-gradient */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-2xl border-2 border-transparent bg-clip-padding shadow-2xl p-8 sm:p-10 w-full relative overflow-hidden group transition-all duration-300">
          <div className="absolute -inset-0.5 rounded-2xl pointer-events-none group-hover:blur-[2px] group-hover:opacity-80 opacity-60 z-0 bg-gradient-to-br from-indigo-400/40 via-purple-400/30 to-pink-400/20" />
          <div className="relative z-10">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex flex-row items-center py-4 mb-6 rounded-2xl font-bold bg-white/80 border-2 border-slate-200 hover:border-indigo-400 shadow-xl hover:shadow-[0_8px_32px_0_rgba(124,58,237,0.18)] transition-all duration-200 text-slate-800 hover:bg-white/95 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-[3px] active:scale-[0.98] active:shadow-md"
              disabled={googleLoading}
              style={{ boxShadow: '0 8px 32px 0 rgba(124,58,237,0.13), 0 2px 8px 0 rgba(80,0,120,0.10)' }}
            >
              <span className="flex items-center justify-center ml-3 mr-4">
                {/* Logo Gmail multicolore, parfaitement centré, sans fond */}
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                  <path d="M44 39c0 1.1-.9 2-2 2h-4V23.83l6-4.66V39z" fill="#4285F4"/>
                  <path d="M4 39V19.17l6 4.66V41H6c-1.1 0-2-.9-2-2z" fill="#34A853"/>
                  <path d="M40 7H8c-2.21 0-4 1.79-4 4v2.99l20 15.54 20-15.54V11c0-2.21-1.79-4-4-4z" fill="#EA4335"/>
                  <path d="M44 11v2.99l-20 15.54-20-15.54V11c0-2.21 1.79-4 4-4h32c2.21 0 4 1.79 4 4z" fill="#FBBC05"/>
                  <path d="M10 23.83V41h28V23.83l-14 10.86-14-10.86z" fill="#fff"/>
                  <path d="M44 11v2.99l-20 15.54-20-15.54V11c0-2.21 1.79-4 4-4h32c2.21 0 4 1.79 4 4z" fill="none"/>
                </svg>
              </span>
              <span className="flex-1 text-center font-bold text-base tracking-wide">{googleLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Continuer avec Gmail"}</span>
            </button>
            {googleError && <div className="text-xs text-red-500 mb-4 animate-fade-in text-center">{googleError}</div>}
            {/* Séparateur visuel */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent blur-[0.5px]" />
              <span className="mx-4 text-indigo-400 text-base font-semibold select-none drop-shadow-sm">ou</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-indigo-400/70 to-transparent blur-[0.5px]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight font-sans">Connexion</h1>
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
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
              {/* Mot de passe */}
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
              {/* Erreur globale */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-2 animate-fade-in shadow-sm">{error}</div>
              )}
              {/* Bouton connexion */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] text-lg"
                disabled={isSubmitting || loading || !isEmailValid || !isPasswordValid}
              >
                {isSubmitting || loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSubmitting || loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
            {/* Footer avec liens */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-sm gap-2">
              <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Mot de passe oublié ?</Link>
              <span className="text-slate-500">Pas de compte ? <Link href="/register" className="text-indigo-500 hover:underline transition-colors">Créer un compte</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 