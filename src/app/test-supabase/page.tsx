"use client";

import React from 'react';
import { SupabaseTest } from '@/components/SupabaseTest';
import { useAuth } from '@/contexts/AuthContext';

export default function TestSupabasePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">🔒 Accès requis</h1>
            <p className="text-gray-600">
              Vous devez être connecté pour accéder aux tests Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2">🧪 Tests Supabase</h1>
          <p className="text-gray-600">
            Page de test pour vérifier la configuration de votre base de données Supabase.
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Utilisateur connecté:</strong> {user.email}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Instructions</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <p>Exécutez d'abord le <strong>Test de connexion</strong> pour vérifier que Supabase est configuré correctement.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <p>Testez les opérations CRUD (Insertion, Mise à jour, Suppression) pour vérifier les permissions.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <p>Testez le <strong>RLS</strong> pour vérifier que chaque utilisateur ne voit que ses propres données.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <p>Utilisez <strong>Migration Données</strong> pour transférer vos données existantes vers Supabase.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">5.</span>
              <p>Consultez les <strong>Stats</strong> pour voir le nombre d'articles dans votre base de données.</p>
            </div>
          </div>
        </div>

        {/* Tests */}
        <SupabaseTest />

        {/* Informations de débogage */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Informations de débogage</h2>
          <div className="space-y-2 text-sm">
            <p><strong>URL Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurée' : '❌ Manquante'}</p>
            <p><strong>Clé Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Manquante'}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        {/* Prochaines étapes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Prochaines étapes</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <p>Une fois les tests réussis, vous pouvez supprimer cette page de test.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <p>Vos données seront automatiquement synchronisées avec Supabase.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <p>Vous pouvez maintenant utiliser toutes les fonctionnalités de votre application avec une vraie base de données.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 