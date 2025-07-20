"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SalesChart, RevenueChart } from "@/components/Charts";
import { useData } from "@/contexts/DataContext";
import { useStats } from "@/contexts/StatsContext";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Eye,
  Heart,
  Star,
  Target,
  Users,
  Activity,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Clock,
  Truck,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyticsPage() {
  const { ventes, articles, stock } = useData();
  const stats = useStats();
  const [periode, setPeriode] = useState("6mois");
  const [categorie, setCategorie] = useState("Toutes");
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  // Données pour les graphiques
  const donneesGraphiques = useMemo(() => {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    return mois.map((mois, index) => {
      const ventesMois = ventes.filter((_, i) => i % 6 === index).length;
      const revenusMois = ventes
        .filter((_, i) => i % 6 === index)
        .reduce((sum, v) => sum + v.prix, 0);
      return {
        name: mois,
        ventes: ventesMois,
        revenus: revenusMois,
        marge: ventes
          .filter((_, i) => i % 6 === index)
          .reduce((sum, v) => sum + v.marge, 0)
      };
    });
  }, [ventes]);

  // Statistiques principales
  const statsLocal = useMemo(() => {
    const ventesFiltrees = categorie === "Toutes"
      ? ventes
      : ventes.filter(v => v.categorie === categorie);
    const totalVentes = ventesFiltrees.length;
    const chiffreAffaires = ventesFiltrees.reduce((sum, v) => sum + v.prix, 0);
    const margeTotale = ventesFiltrees.reduce((sum, v) => sum + v.marge, 0);
    const panierMoyen = totalVentes > 0 ? chiffreAffaires / totalVentes : 0;
    const margeMoyenne = totalVentes > 0 ? margeTotale / totalVentes : 0;
    const tauxMarge = chiffreAffaires > 0 ? (margeTotale / chiffreAffaires) * 100 : 0;
    return {
      totalVentes,
      chiffreAffaires,
      margeTotale,
      panierMoyen,
      margeMoyenne,
      tauxMarge
    };
  }, [categorie, ventes]);

  // Top articles
  const topArticles = useMemo(() => {
    const articlesVentes = articles
      .filter(a => a.statut === "Vendu")
      .sort((a, b) => b.vues - a.vues)
      .slice(0, 5);
    return articlesVentes.map(article => ({
      nom: article.nom,
      vues: article.vues,
      likes: article.likes,
      prix: article.prix,
      marge: article.marge
    }));
  }, [articles]);

  // Top catégories
  const topCategories = useMemo(() => {
    const categories = ventes.reduce((acc, vente) => {
      acc[vente.categorie] = (acc[vente.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categories)
      .map(([categorie, count]) => ({ categorie, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [ventes]);

  // Performance par mois
  const performanceMensuelle = useMemo(() => {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    return mois.map((mois, index) => {
      const ventesMois = ventes.filter((_, i) => i % 6 === index);
      const revenus = ventesMois.reduce((sum, v) => sum + v.prix, 0);
      const marges = ventesMois.reduce((sum, v) => sum + v.marge, 0);
      return {
        mois,
        ventes: ventesMois.length,
        revenus,
        marges,
        croissance: index > 0 ? ((revenus - 1000) / 1000) * 100 : 0
      };
    });
  }, [ventes]);

  // Alertes et insights
  const insights = useMemo(() => {
    const insights = [];
    // Stock faible
    const stockFaible = stock.filter(s => s.statut === "Faible" || s.statut === "Rupture").length;
    if (stockFaible > 0) {
      insights.push({
        type: "warning",
        message: `${stockFaible} article(s) en stock faible ou rupture`,
        icon: <Package className="w-4 h-4" />
      });
    }
    // Articles non vendus
    const articlesNonVendus = articles.filter(a => a.statut === "En vente" && a.vues < 10).length;
    if (articlesNonVendus > 0) {
      insights.push({
        type: "info",
        message: `${articlesNonVendus} article(s) avec peu de vues`,
        icon: <Eye className="w-4 h-4" />
      });
    }
    // Marge faible
    const margeFaible = articles.filter(a => a.margePourcent < 50).length;
    if (margeFaible > 0) {
      insights.push({
        type: "warning",
        message: `${margeFaible} article(s) avec marge faible (<50%)`,
        icon: <TrendingUp className="w-4 h-4" />
      });
    }
    return insights;
  }, [articles, stock]);

  // Dataset dynamique pour les graphiques (groupé par mois)
  const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const ventesParMois = useMemo(() => {
    const grouped = Array(12).fill(0).map((_, i) => ({
      name: mois[i],
      ventes: 0,
      revenus: 0,
      marge: 0
    }));
    ventes.forEach(v => {
      const [day, month, year] = v.date.split('/');
      const idx = parseInt(month, 10) - 1;
      if (grouped[idx]) {
        grouped[idx].ventes += 1;
        grouped[idx].revenus += v.prix;
        grouped[idx].marge += v.marge;
      }
    });
    return grouped;
  }, [ventes]);

  const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
  const periodes = [
    { value: "7jours", label: "7 jours" },
    { value: "30jours", label: "30 jours" },
    { value: "3mois", label: "3 mois" },
    { value: "6mois", label: "6 mois" },
    { value: "1an", label: "1 an" }
  ];

  // Calcul dynamique de la période précédente pour analytics
  function getPreviousPeriodDatesAnalytics(period: string) {
    const now = new Date();
    let endDate = new Date(now);
    let startDate = new Date(now);
    let prevEnd = new Date(now);
    let prevStart = new Date(now);
    switch (period) {
      case '7jours':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setDate(now.getDate() - 7);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setDate(prevEnd.getDate() - 7);
        break;
      case '30jours':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setDate(now.getDate() - 30);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setDate(prevEnd.getDate() - 30);
        break;
      case '3mois':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 3);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setMonth(prevEnd.getMonth() - 3);
        break;
      case '6mois':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 6);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setMonth(prevEnd.getMonth() - 6);
        break;
      case '1an':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setFullYear(now.getFullYear() - 1);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setFullYear(prevEnd.getFullYear() - 1);
        break;
      default:
        break;
    }
    return { prevStart, prevEnd };
  }

  // Ajout : calcul de la période courante pour analytics
  function getCurrentPeriodDatesAnalytics(period: string) {
    const now = new Date();
    let endDate = new Date(now);
    let startDate = new Date(now);
    switch (period) {
      case '7jours':
        startDate = new Date(now); startDate.setDate(now.getDate() - 7);
        break;
      case '30jours':
        startDate = new Date(now); startDate.setDate(now.getDate() - 30);
        break;
      case '3mois':
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 3);
        break;
      case '6mois':
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 6);
        break;
      case '1an':
        startDate = new Date(now); startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    return { startDate, endDate };
  }
  const { startDate, endDate } = getCurrentPeriodDatesAnalytics(periode);
  const { prevStart, prevEnd } = getPreviousPeriodDatesAnalytics(periode);
  const ventesFiltrees = categorie === "Toutes" ? ventes : ventes.filter(v => v.categorie === categorie);
  const ventesPeriode = ventesFiltrees.filter(v => {
    const venteDate = new Date(v.date.split('/').reverse().join('-'));
    return venteDate >= startDate && venteDate <= endDate;
  });
  const previousVentes = ventesFiltrees.filter(v => {
    const venteDate = new Date(v.date.split('/').reverse().join('-'));
    return venteDate >= prevStart && venteDate <= prevEnd;
  });
  function getTendance(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }
  const evolutionVentes = getTendance(ventesPeriode.length, previousVentes.length);
  const evolutionCA = getTendance(ventesPeriode.reduce((sum, v) => sum + v.prix, 0), previousVentes.reduce((sum, v) => sum + v.prix, 0));
  const evolutionMarge = getTendance(ventesPeriode.reduce((sum, v) => sum + v.marge, 0), previousVentes.reduce((sum, v) => sum + v.marge, 0));
  const evolutionPanier = getTendance(
    ventesPeriode.length > 0 ? ventesPeriode.reduce((sum, v) => sum + v.prix, 0) / ventesPeriode.length : 0,
    previousVentes.length > 0 ? previousVentes.reduce((sum, v) => sum + v.prix, 0) / previousVentes.length : 0
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="analytics-page"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
      >
        {/* Header avec titre et actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Analysez vos performances et optimisez vos ventes</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-indigo-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Download className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                Exporter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300 hover:scale-105"
              >
                {periodes.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300 hover:scale-105"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-indigo-300 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => setFiltresOuverts(!filtresOuverts)}
              >
                <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                Filtres avancés
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Cartes de statistiques principales */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Ventes totales"
            value={statsLocal.totalVentes.toString()}
            subtitle="Cette période"
            icon={<ShoppingCart className="w-6 h-6" />}
            color="blue"
            evolution={`${evolutionVentes >= 0 ? '+' : ''}${evolutionVentes.toFixed(1)}%`}
          />
          <StatCard
            title="Chiffre d'affaires"
            value={`${statsLocal.chiffreAffaires.toLocaleString()}€`}
            subtitle="CA total"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            evolution={`${evolutionCA >= 0 ? '+' : ''}${evolutionCA.toFixed(1)}%`}
          />
          <StatCard
            title="Marge totale"
            value={`${statsLocal.margeTotale.toLocaleString()}€`}
            subtitle="Bénéfices"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            evolution={`${evolutionMarge >= 0 ? '+' : ''}${evolutionMarge.toFixed(1)}%`}
          />
          <StatCard
            title="Panier moyen"
            value={`${statsLocal.panierMoyen.toFixed(0)}€`}
            subtitle="Par vente"
            icon={<Users className="w-6 h-6" />}
            color="orange"
            evolution={`${evolutionPanier >= 0 ? '+' : ''}${evolutionPanier.toFixed(1)}%`}
          />
        </motion.div>

        {/* Graphiques */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Graphique des ventes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <BarChart3 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Évolution des ventes</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Ventes par mois</p>
              </div>
            </div>
            <SalesChart data={ventesParMois} />
          </div>

          {/* Graphique des revenus */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <TrendingUp className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Évolution des revenus</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Revenus par mois</p>
              </div>
            </div>
            <RevenueChart data={ventesParMois} />
          </div>
        </motion.div>

        {/* Insights et alertes */}
        <AnimatePresence>
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Sparkles className="w-5 h-5 text-yellow-600 group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 text-lg group-hover:text-yellow-900 transition-colors duration-200">Insights et recommandations</h3>
                  <p className="text-yellow-600 text-sm group-hover:text-yellow-700 transition-colors duration-200">Optimisez vos performances</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-100/50 rounded-xl hover:bg-yellow-100 hover:scale-105 transition-all duration-200 cursor-pointer group">
                    <div className="p-2 bg-yellow-200 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      {insight.icon}
                    </div>
                    <span className="text-sm text-yellow-800 group-hover:text-yellow-900 transition-colors duration-200">{insight.message}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top articles et catégories */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Top articles */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <Star className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Top articles</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Les plus populaires</p>
              </div>
            </div>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 group-hover:scale-110 transition-transform duration-200">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{article.nom}</div>
                    <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">{article.vues} vues • {article.likes} likes</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{article.prix}€</div>
                    <div className="text-sm text-green-600 group-hover:text-green-700 transition-colors duration-200">+{article.marge}€</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top catégories */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <Target className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Top catégories</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Performance par catégorie</p>
              </div>
            </div>
            <div className="space-y-4">
              {topCategories.map((cat, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center font-bold text-orange-600 group-hover:scale-110 transition-transform duration-200">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{cat.categorie}</div>
                    <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">{cat.count} ventes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                      {((cat.count / ventes.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Composants utilitaires
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  evolution 
}: { 
  title: string, 
  value: string, 
  subtitle: string, 
  icon: React.ReactNode,
  color: string,
  evolution?: string
}) {
  const isPositive = evolution?.startsWith('+');
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-200">
            {React.cloneElement(icon as React.ReactElement, { 
              className: 'w-6 h-6 group-hover:scale-110 transition-transform duration-200' 
            })}
          </div>
          {evolution && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <TrendingUp className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="font-semibold group-hover:scale-110 transition-transform duration-200">{evolution}</span>
            </div>
          )}
        </div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold group-hover:scale-105 transition-transform duration-200">{title}</h3>
          <p className="text-2xl font-bold group-hover:scale-105 transition-transform duration-200">{value}</p>
        </div>
        <p className="text-white/80 text-sm group-hover:text-white transition-colors duration-200">{subtitle}</p>
      </div>
    </div>
  );
} 