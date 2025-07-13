"use client";

import { Crown, CheckCircle, XCircle, HelpCircle, Mail, Star, Zap, Shield, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AbonnementPage() {
  // Mock : l'utilisateur est sur le plan gratuit
  const isPremium = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header avec PageHeader moderne */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Abonnement Premium</h1>
              <p className="text-slate-600">Débloquez tout le potentiel de votre boutique Vinted</p>
            </div>
          </div>
          
          {/* Bandeau promotionnel */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-xl font-bold">Offre limitée : -35% sur Premium</span>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <p className="text-indigo-100">Votre formule actuelle : <span className="font-semibold">{isPremium ? "Premium" : "Gratuit"}</span></p>
          </div>
        </div>

        {/* Cartes de comparaison modernisées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plan Gratuit */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Gratuit</h2>
              <div className="text-3xl font-bold text-slate-600 mb-1">0€</div>
              <div className="text-slate-500 text-sm">par mois</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700">50 articles suivis</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700">25 ventes par mois</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-slate-300" />
                <span className="text-slate-400">Alertes IA personnalisées</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-slate-300" />
                <span className="text-slate-400">Statistiques avancées</span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-slate-300" />
                <span className="text-slate-400">Support prioritaire</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              disabled
            >
              Plan actuel
            </Button>
          </div>

          {/* Plan Premium */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 p-8 shadow-lg relative overflow-visible">
            {/* Badge Premium ruban stylé */}
            <div className="absolute -top-6 right-0 z-20 transform rotate-12">
              <div className="flex items-center gap-1 px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white text-lg font-extrabold shadow-2xl drop-shadow-lg rounded-lg border-2 border-white/80 ring-2 ring-orange-300"
                style={{ boxShadow: '0 6px 24px 0 rgba(255, 140, 0, 0.25)' }}>
                <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                -35%
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium</h2>
              <div className="text-3xl font-bold text-indigo-600 mb-1">19€</div>
              <div className="text-slate-500 text-sm">par mois (après réduction)</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Articles illimités</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Ventes illimitées</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Alertes IA personnalisées</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Statistiques avancées</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Support prioritaire</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>Passer à Premium</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Avantages Premium */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Pourquoi passer à Premium ?</h2>
            <p className="text-slate-600">Découvrez tous les avantages qui vont booster votre activité</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Performance illimitée</h3>
              <p className="text-slate-600 text-sm">Aucune limite d'articles ou de ventes pour développer votre activité</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Analytics avancées</h3>
              <p className="text-slate-600 text-sm">Statistiques détaillées pour optimiser vos performances</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">IA personnalisée</h3>
              <p className="text-slate-600 text-sm">Alertes et conseils intelligents adaptés à votre activité</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Support prioritaire</h3>
              <p className="text-slate-600 text-sm">Une équipe dédiée pour vous accompagner 24h/24</p>
            </div>
          </div>
        </div>

        {/* FAQ et Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Questions fréquentes</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-1">Comment changer de formule ?</h4>
                <p className="text-slate-600 text-sm">Cliquez sur "Passer à Premium" et suivez les étapes de paiement sécurisé.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-1">Puis-je annuler à tout moment ?</h4>
                <p className="text-slate-600 text-sm">Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-800 mb-1">Le paiement est-il sécurisé ?</h4>
                <p className="text-slate-600 text-sm">Absolument, nous utilisons les standards de sécurité les plus élevés.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Besoin d'aide ?</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-600">Notre équipe support vous répond sous 24h pour toute question.</p>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-slate-800">support@vintedpro.com</div>
                    <div className="text-slate-600 text-sm">Réponse garantie sous 24h</div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                <strong>Essai gratuit 7 jours</strong> - Aucun engagement, annulez à tout moment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 