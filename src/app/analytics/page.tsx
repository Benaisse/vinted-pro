"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SalesChart, RevenueChart } from "@/components/Charts";
import { ventes as ventesData } from "@/data/ventes";
import { inventaire as inventaireData } from "@/data/inventaire";
import { stock as stockData } from "@/data/stock";
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
  Activity
} from "lucide-react";

export default function AnalyticsPage() {
  const [periode, setPeriode] = useState("6mois");
  const [categorie, setCategorie] = useState("Toutes");

  // Données pour les graphiques
  const donneesGraphiques = useMemo(() => {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    return mois.map((mois, index) => {
      const ventesMois = ventesData.filter((_, i) => i % 6 === index).length;
      const revenusMois = ventesData
        .filter((_, i) => i % 6 === index)
        .reduce((sum, v) => sum + v.prix, 0);
      
      return {
        name: mois,
        ventes: ventesMois,
        revenus: revenusMois,
        marge: ventesData
          .filter((_, i) => i % 6 === index)
          .reduce((sum, v) => sum + v.marge, 0)
      };
    });
  }, []);

  // Statistiques principales
  const stats = useMemo(() => {
    const ventesFiltrees = categorie === "Toutes" 
      ? ventesData 
      : ventesData.filter(v => v.categorie === categorie);

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
  }, [categorie]);

  // Top articles
  const topArticles = useMemo(() => {
    const articlesVentes = inventaireData
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
  }, []);

  // Top catégories
  const topCategories = useMemo(() => {
    const categories = ventesData.reduce((acc, vente) => {
      acc[vente.categorie] = (acc[vente.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories)
      .map(([categorie, count]) => ({ categorie, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, []);

  // Performance par mois
  const performanceMensuelle = useMemo(() => {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    return mois.map((mois, index) => {
      const ventesMois = ventesData.filter((_, i) => i % 6 === index);
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
  }, []);

  // Alertes et insights
  const insights = useMemo(() => {
    const insights = [];
    
    // Stock faible
    const stockFaible = stockData.filter(s => s.statut === "Faible" || s.statut === "Rupture").length;
    if (stockFaible > 0) {
      insights.push({
        type: "warning",
        message: `${stockFaible} article(s) en stock faible ou rupture`,
        icon: <Package className="w-4 h-4" />
      });
    }

    // Articles non vendus
    const articlesNonVendus = inventaireData.filter(a => a.statut === "En vente" && a.vues < 10).length;
    if (articlesNonVendus > 0) {
      insights.push({
        type: "info",
        message: `${articlesNonVendus} article(s) avec peu de vues`,
        icon: <Eye className="w-4 h-4" />
      });
    }

    // Marge faible
    const margeFaible = inventaireData.filter(a => a.margePourcent < 50).length;
    if (margeFaible > 0) {
      insights.push({
        type: "warning",
        message: `${margeFaible} article(s) avec marge faible (<50%)`,
        icon: <TrendingUp className="w-4 h-4" />
      });
    }

    return insights;
  }, []);

  const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
  const periodes = [
    { value: "7jours", label: "7 jours" },
    { value: "30jours", label: "30 jours" },
    { value: "3mois", label: "3 mois" },
    { value: "6mois", label: "6 mois" },
    { value: "1an", label: "1 an" }
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Analysez vos performances et optimisez vos ventes</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periodes.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes totales"
          value={stats.totalVentes.toString()}
          subtitle="Cette période"
          icon={<ShoppingCart className="w-5 h-5" />}
          color="blue"
          evolution="+12%"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={`${stats.chiffreAffaires.toFixed(0)}€`}
          subtitle="Total des ventes"
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
          evolution="+8%"
        />
        <StatCard
          title="Marge totale"
          value={`${stats.margeTotale.toFixed(0)}€`}
          subtitle="Bénéfice net"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
          evolution="+15%"
        />
        <StatCard
          title="Panier moyen"
          value={`${stats.panierMoyen.toFixed(0)}€`}
          subtitle="Par vente"
          icon={<Target className="w-5 h-5" />}
          color="orange"
          evolution="+5%"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Évolution des ventes</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Ventes
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Revenus
            </div>
          </div>
          <SalesChart />
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenus mensuels</h3>
            <div className="text-sm text-gray-500">
              {periode === "6mois" ? "6 derniers mois" : periode}
            </div>
          </div>
          <RevenueChart />
        </div>
      </div>

      {/* Insights et alertes */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Insights et alertes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  insight.type === "warning" 
                    ? "bg-orange-50 border-orange-200" 
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <span className={`text-sm font-medium ${
                    insight.type === "warning" ? "text-orange-800" : "text-blue-800"
                  }`}>
                    {insight.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top articles et catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top articles */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Top articles
          </h3>
          <div className="space-y-3">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{article.nom}</div>
                    <div className="text-sm text-gray-500">
                      {article.vues} vues • {article.likes} likes
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{article.prix}€</div>
                  <div className="text-sm text-green-600">+{article.marge}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top catégories */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Top catégories
          </h3>
          <div className="space-y-4">
            {topCategories.map((cat, index) => {
              const pourcentage = (cat.count / ventesData.length) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{cat.categorie}</span>
                    <span className="text-sm text-gray-500">{cat.count} ventes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pourcentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{pourcentage.toFixed(1)}% des ventes</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance mensuelle détaillée */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Performance mensuelle
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performanceMensuelle.map((perf, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {perf.mois}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.ventes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.revenus.toFixed(0)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.marges.toFixed(0)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      perf.croissance > 0 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {perf.croissance > 0 ? "+" : ""}{perf.croissance.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Composant StatCard amélioré avec évolution
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
  const colorMap: any = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-600 text-white",
    orange: "bg-orange-500 text-white",
  };
  
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-2 ${colorMap[color]} shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{title}</span>
        {icon}
      </div>
      <span className="text-2xl font-bold">{value}</span>
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-80">{subtitle}</span>
        {evolution && (
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {evolution}
          </span>
        )}
      </div>
    </div>
  );
} 