import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function AbonnementCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 mb-2">Paiement annulé</h1>
      <p className="text-lg text-red-800 mb-6">Votre paiement n'a pas été finalisé. Vous pouvez réessayer à tout moment.</p>
      <Link href="/abonnement">
        <span className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">Retour à l'abonnement</span>
      </Link>
    </div>
  );
} 