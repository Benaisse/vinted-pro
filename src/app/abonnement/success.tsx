import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function AbonnementSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 mb-2">Abonnement activé !</h1>
      <p className="text-lg text-green-800 mb-6">Merci pour votre confiance. Votre abonnement est maintenant actif.</p>
      <Link href="/abonnement">
        <span className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Retour à l'abonnement</span>
      </Link>
    </div>
  );
} 