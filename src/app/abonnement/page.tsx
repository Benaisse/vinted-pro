"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, CheckCircle, XCircle, HelpCircle, Mail, Star, Zap, Shield, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AbonnementPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubscription() {
      setLoading(true);
      try {
        if (user) {
          const { data: subData } = await supabase
            .from('user_subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .single();
          if (subData) setSubscription(subData);
          else setSubscription({ plan: 'free', status: 'active' });
        }
      } catch (e) {
        setError("Erreur lors de la récupération de l'abonnement");
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [user]);

  const handleUpgradeToPremium = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert([
          { user_id: user.id, plan: 'premium', status: 'active', start_date: new Date().toISOString() }
        ], { onConflict: 'user_id' });
      if (error) throw error;
      setSubscription({ plan: 'premium', status: 'active' });
      setSuccess('Vous êtes maintenant Premium !');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du passage à Premium');
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="abonnement-page"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header avec PageHeader moderne */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Crown className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">Abonnement Premium</h1>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Débloquez tout le potentiel de votre boutique Vinted</p>
              </div>
            </div>
            
            {/* Bandeau promotionnel */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform duration-200" />
                <span className="text-xl font-bold group-hover:scale-105 transition-transform duration-200">Offre limitée : -35% sur Premium</span>
                <Sparkles className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <p className="text-indigo-100 group-hover:text-white transition-colors duration-200">
                Votre formule actuelle : <span className="font-semibold">{subscription?.plan === 'premium' ? 'Premium' : 'Gratuit'}</span>
              </p>
            </div>
          </motion.div>

          {/* Cartes de comparaison modernisées */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Plan Gratuit */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Users className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Gratuit</h2>
                <div className="text-3xl font-bold text-slate-600 mb-1 group-hover:text-slate-700 transition-colors duration-200">0€</div>
                <div className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">par mois</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 group-hover:text-slate-800 transition-colors duration-200">50 articles suivis</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 group-hover:text-slate-800 transition-colors duration-200">25 ventes par mois</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <XCircle className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-400 group-hover:text-slate-500 transition-colors duration-200">Alertes IA personnalisées</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <XCircle className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-400 group-hover:text-slate-500 transition-colors duration-200">Statistiques avancées</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <XCircle className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-400 group-hover:text-slate-500 transition-colors duration-200">Support prioritaire</span>
                </div>
              </div>
              
                          <Button 
              variant="outline" 
              className="w-full bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
              disabled
            >
              Plan actuel
            </Button>
            </div>

            {/* Plan Premium */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 p-8 shadow-lg relative overflow-visible hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              {/* Badge Premium ruban stylé */}
              <div className="absolute -top-6 right-0 z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-1 px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white text-lg font-extrabold shadow-2xl drop-shadow-lg rounded-lg border-2 border-white/80 ring-2 ring-orange-300 group-hover:scale-110 transition-transform duration-200"
                  style={{ boxShadow: '0 6px 24px 0 rgba(255, 140, 0, 0.25)' }}>
                  <svg className="w-5 h-5 text-white drop-shadow group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  -35%
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Crown className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Premium</h2>
                <div className="text-3xl font-bold text-indigo-600 mb-1 group-hover:text-indigo-700 transition-colors duration-200">19€</div>
                <div className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">par mois (après réduction)</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">Articles illimités</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">Ventes illimitées</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">Alertes IA personnalisées</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">Statistiques avancées</span>
                </div>
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">Support prioritaire</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={handleUpgradeToPremium}
                disabled={subscription?.plan === 'premium'}
              >
                {subscription?.plan === 'premium' ? 'Déjà Premium' : 'Passer à Premium'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </motion.div>

          {/* Avantages Premium */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Pourquoi passer à Premium ?</h2>
              <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Découvrez tous les avantages qui vont booster votre activité</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Zap className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Performance illimitée</h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Aucune limite d'articles ou de ventes pour développer votre activité</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Analytics avancées</h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Statistiques détaillées pour optimiser vos performances</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Star className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">IA personnalisée</h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Alertes et conseils intelligents adaptés à votre activité</p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Shield className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">Support prioritaire</h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Une équipe dédiée pour vous accompagner 24h/24</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ et Support */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
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
          </motion.div>
        </div>
        {success && <div className="text-green-600 text-center my-2">{success}</div>}
        {error && <div className="text-red-600 text-center my-2">{error}</div>}
      </motion.div>
    </AnimatePresence>
  );
} 