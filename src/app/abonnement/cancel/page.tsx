import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function AbonnementCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-10 shadow-lg flex flex-col items-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4 animate-fade-in" />
        <h1 className="text-3xl font-bold text-red-700 mb-2 text-center">Paiement annulé</h1>
        <p className="text-lg text-red-800 mb-6 text-center">Votre paiement n'a pas été finalisé.<br/>Vous pouvez réessayer à tout moment pour profiter des avantages Premium.</p>
        <Link href="/abonnement" className="w-full">
          <span className="block w-full text-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md">Retour à l'abonnement</span>
        </Link>
      </div>
    </div>
  );
} 