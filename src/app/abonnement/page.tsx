"use client";

import { Crown, CheckCircle, XCircle, HelpCircle, Mail } from "lucide-react";

export default function AbonnementPage() {
  // Mock : l'utilisateur est sur le plan gratuit
  const isPremium = false;

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
      {/* Header visuel */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-gradient-to-tr from-purple-500 to-pink-500 h-32 flex items-center px-8">
          <Crown className="w-14 h-14 text-yellow-300 drop-shadow-lg opacity-90" />
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-white mb-1">Abonnement</h1>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">Votre formule : {isPremium ? "Premium" : "Gratuit"}</span>
              {!isPremium && <span className="bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold ml-2">-35% sur Premium</span>}
            </div>
          </div>
        </div>
        <Crown className="absolute right-6 top-2 w-20 h-20 text-yellow-200 opacity-20 pointer-events-none" />
      </div>

      {/* Comparatif des offres */}
      <div className="mb-10">
        <div className="font-semibold text-lg mb-4 text-center">Comparez les formules</div>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="w-1/2 text-lg font-bold py-2 bg-gray-50 rounded-tl-xl">Gratuit</th>
                <th className="w-1/2 text-lg font-bold py-2 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-tr-xl relative">
                  Premium
                  <span className="absolute top-2 right-4 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">-35%</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="bg-white text-center py-3 rounded-l-xl">0€/mois</td>
                <td className="bg-white text-center py-3 rounded-r-xl font-bold text-purple-600 shadow-lg border-2 border-purple-200">19€/mois</td>
              </tr>
              <tr>
                <td className="bg-gray-50 text-center py-2">50 articles suivis</td>
                <td className="bg-purple-50 text-center py-2 font-semibold">Articles illimités</td>
              </tr>
              <tr>
                <td className="bg-gray-50 text-center py-2">25 ventes/mois</td>
                <td className="bg-purple-50 text-center py-2 font-semibold">Ventes illimitées</td>
              </tr>
              <tr>
                <td className="bg-gray-50 text-center py-2"><XCircle className="inline w-4 h-4 text-gray-300 mr-1" />Alertes IA personnalisées</td>
                <td className="bg-purple-50 text-center py-2 font-semibold"><CheckCircle className="inline w-4 h-4 text-green-500 mr-1" />Alertes IA personnalisées</td>
              </tr>
              <tr>
                <td className="bg-gray-50 text-center py-2"><XCircle className="inline w-4 h-4 text-gray-300 mr-1" />Statistiques avancées</td>
                <td className="bg-purple-50 text-center py-2 font-semibold"><CheckCircle className="inline w-4 h-4 text-green-500 mr-1" />Statistiques avancées</td>
              </tr>
              <tr>
                <td className="bg-gray-50 text-center py-2 rounded-bl-xl"><XCircle className="inline w-4 h-4 text-gray-300 mr-1" />Support prioritaire</td>
                <td className="bg-purple-50 text-center py-2 font-semibold rounded-br-xl"><CheckCircle className="inline w-4 h-4 text-green-500 mr-1" />Support prioritaire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Pourquoi Premium */}
      <div className="mb-10">
        <div className="font-semibold text-lg mb-4 text-center">Pourquoi passer à Premium ?</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-shadow flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="font-semibold">Aucune limite d’articles ou de ventes</div>
              <div className="text-sm text-gray-500">Développez votre activité sans contrainte.</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-shadow flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="font-semibold">Alertes IA personnalisées</div>
              <div className="text-sm text-gray-500">Recevez des conseils et alertes sur-mesure.</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-shadow flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="font-semibold">Statistiques avancées</div>
              <div className="text-sm text-gray-500">Analysez vos performances en détail.</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-shadow flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="font-semibold">Support prioritaire</div>
              <div className="text-sm text-gray-500">Une équipe dédiée pour vous accompagner.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="flex flex-col items-center mb-10">
        {isPremium ? (
          <button className="bg-gray-100 text-gray-500 font-semibold py-3 px-8 rounded-lg cursor-not-allowed">Déjà Premium</button>
        ) : (
          <button className="bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg">Passer à Premium</button>
        )}
        {!isPremium && (
          <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 mt-2">Limite gratuite : 50 articles suivis, 25 ventes/mois</div>
        )}
      </div>

      {/* FAQ & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2"><HelpCircle className="w-5 h-5 text-purple-500" /><span className="font-semibold">Questions fréquentes</span></div>
          <div className="text-sm text-gray-600">• Comment changer de formule ?<br />• Puis-je annuler à tout moment ?<br />• Le paiement est-il sécurisé ?</div>
          <div className="text-xs text-gray-400 mt-2">Plus de réponses dans la documentation ou contactez-nous.</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2"><Mail className="w-5 h-5 text-pink-500" /><span className="font-semibold">Besoin d’aide ?</span></div>
          <div className="text-sm text-gray-600">Notre équipe support vous répond sous 24h.<br />Contact : <a href="mailto:support@vintedpro.com" className="text-purple-600 underline">support@vintedpro.com</a></div>
        </div>
      </div>
    </div>
  );
} 