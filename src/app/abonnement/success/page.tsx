import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function AbonnementSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-10 shadow-lg flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-fade-in" />
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">Abonnement activé !</h1>
        <p className="text-lg text-green-800 mb-6 text-center">Merci pour votre confiance. Votre abonnement est maintenant actif.<br/>Profitez de toutes les fonctionnalités Premium !</p>
        <Link href="/abonnement" className="w-full">
          <span className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md">Retour à l'abonnement</span>
        </Link>
      </div>
    </div>
  );
} 