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

  const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
  const periodes = [
    { value: "7jours", label: "7 jours" },
    { value: "30jours", label: "30 jours" },
    { value: "3mois", label: "3 mois" },
    { value: "6mois", label: "6 mois" },
    { value: "1an", label: "1 an" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec titre et actions */}
      <div className="mb-8">
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
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white"
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ventes totales"
          value={stats?.totalVentes != null ? stats.totalVentes.toString() : '0'}
          subtitle="Cette période"
          icon={<ShoppingCart className="w-6 h-6" />}
          color="blue"
          evolution="+12%"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={stats?.totalRevenus != null ? stats.totalRevenus.toString() + '€' : '0€'}
          subtitle="Total des ventes"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          evolution="+8%"
        />
        <StatCard
          title="Total articles"
          value={stats?.totalArticles != null ? stats.totalArticles.toString() : '0'}
          subtitle="Dans l'inventaire"
          icon={<Package className="w-6 h-6" />}
          color="purple"
          evolution="+15%"
        />
        <StatCard
          title="Stock critique"
          value={stats?.stockCritique != null ? stats.stockCritique.toString() : '0'}
          subtitle="Articles en stock critique"
          icon={<AlertCircle className="w-6 h-6" />}
          color="orange"
          evolution="+5%"
        />
      </div>

      {/* Section filtres */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filtres d'analyse</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFiltresOuverts(!filtresOuverts)}
            className="flex items-center gap-2"
          >
            {filtresOuverts ? "Masquer" : "Afficher"} les filtres
            <ChevronDown className={`w-4 h-4 transition-transform ${filtresOuverts ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {filtresOuverts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Période</label>
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {periodes.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Insights et alertes */}
      {insights.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">Insights et alertes</h3>
              <p className="text-slate-600 text-sm">Points d'attention pour optimiser vos performances</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  insight.type === "warning" 
                    ? "bg-orange-50 border-orange-200 text-orange-800" 
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <span className="text-sm font-medium">{insight.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Évolution des ventes</h3>
          </div>
          <div className="h-64">
            <SalesChart />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Revenus et marges</h3>
          </div>
          <div className="h-64">
            <RevenueChart />
          </div>
        </div>
      </div>

      {/* Top articles et catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Top articles</h3>
          </div>
          <div className="space-y-3">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{article.nom}</div>
                    <div className="text-sm text-slate-500">{article.vues} vues • {article.likes} likes</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{article.prix}€</div>
                  <div className="text-sm text-green-600">+{article.marge}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Top catégories</h3>
          </div>
          <div className="space-y-3">
            {topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-xs font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <div className="font-medium text-slate-900">{cat.categorie}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{cat.count}</div>
                  <div className="text-sm text-slate-500">ventes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      {evolution && (
        <div className="flex items-center gap-1 mt-3">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-xs text-green-600 font-medium">{evolution}</span>
        </div>
      )}
    </div>
  );
} 