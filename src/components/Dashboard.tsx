'use client'

import { Button } from "@/components/ui/button";
import { BarChart2, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, AlertTriangle, Star, TrendingUp, DollarSign, Package, Users, Plus, Download, Filter as FilterIcon, Sparkles, X, CalendarDays } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend
} from "recharts";
import React, { useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { ventes as ventesData } from "@/data/ventes";
import { ArticleFormModal, Article } from "@/components/ArticleFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { ImportVintedModal } from "@/components/ImportVintedCSVButton";

// Types pour les périodes
type PeriodType = '7j' | '30j' | '3m' | '1a' | 'custom';

interface PeriodFilter {
  type: PeriodType;
  label: string;
  startDate: Date;
  endDate: Date;
}

// SUPPRIMER allFinancialData, topSalesData, et toute variable mock

const COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#a3a3a3"];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-slate-200 text-xs">
        <div className="font-semibold mb-1 text-slate-800">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }}></span>
            <span className="text-slate-600">{entry.name} :</span>
            <span className="font-bold text-slate-800">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function Dashboard() {
  const { ventes, stats } = useData();
  const [modalOpen, setModalOpen] = React.useState(false);
  
  // États pour les filtres de période
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodType>('30j');
  const [customDateRange, setCustomDateRange] = React.useState({
    startDate: '',
    endDate: ''
  });
  const [showCustomPicker, setShowCustomPicker] = React.useState(false);
  
  // Charger la période sauvegardée depuis localStorage
  React.useEffect(() => {
    const savedPeriod = localStorage.getItem('dashboard-period');
    if (savedPeriod) {
      setSelectedPeriod(savedPeriod as PeriodType);
    }
  }, []);

  // Sauvegarder la période dans localStorage
  React.useEffect(() => {
    localStorage.setItem('dashboard-period', selectedPeriod);
  }, [selectedPeriod]);

  // Calculer les dates selon la période sélectionnée
  const getPeriodDates = (period: PeriodType): { startDate: Date; endDate: Date } => {
    const now = new Date();
    let endDate = new Date(now);
    let startDate = new Date(now);
    
    switch (period) {
      case '7j':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30j':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1a':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (customDateRange.startDate && customDateRange.endDate) {
          startDate = new Date(customDateRange.startDate);
          endDate = new Date(customDateRange.endDate);
        }
        break;
    }
    
    return { startDate, endDate };
  };

  // Filtrer les ventes selon la période
  const { startDate, endDate } = getPeriodDates(selectedPeriod);
  const filteredVentes = useMemo(() => ventes.filter(v => {
    const venteDate = new Date(v.date.split('/').reverse().join('-'));
    return venteDate >= startDate && venteDate <= endDate;
  }), [ventes, startDate, endDate]);

  // Calculer les métriques filtrées à partir des ventes réelles
  const totalCA = useMemo(() => filteredVentes.reduce((sum, v) => sum + v.prix, 0), [filteredVentes]);
  const totalRevenuNet = useMemo(() => filteredVentes.reduce((sum, v) => sum + v.marge, 0), [filteredVentes]);
  const totalRevenus = useMemo(() => filteredVentes.reduce((sum, v) => sum + (v.prix - v.cout), 0), [filteredVentes]);
  const margeMoyenne = useMemo(() => filteredVentes.length > 0 ? (filteredVentes.reduce((sum, v) => sum + v.margePourcent, 0) / filteredVentes.length) : 0, [filteredVentes]);

  // Calculer les tendances (mock - basé sur la période précédente)
  const getTendance = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Simuler les données de la période précédente pour les tendances
  // Pour les graphiques, construire les datasets à partir de ventes (du contexte)
  // Par exemple, pour le graphique d'évolution financière :
  //
  // const chartData = ventes.reduce((acc, v) => {
  //   const month = v.date.split('/')[1] + '/' + v.date.split('/')[2];
  //   let entry = acc.find(e => e.month === month);
  //   if (!entry) {
  //     entry = { month, ca: 0, revenus: 0, marge: 0 };
  //     acc.push(entry);
  //   }
  //   entry.ca += v.prix;
  //   entry.revenus += v.prix - v.cout;
  //   entry.marge += v.marge;
  //   return acc;
  // }, [] as { month: string, ca: number, revenus: number, marge: number }[]);
  //
  // Utiliser chartData dans les AreaChart/BarChart à la place des données mock.
  //
  // Pour le top ventes, faire un groupBy sur article et trier par nombre de ventes.
  //
  // Pour la marge moyenne, calculer à partir de ventes filtrées.
  //
  // Supprimer toute référence à allFinancialData, topSalesData, etc.
  // Calcul dynamique de la période précédente
  function getPreviousPeriodDates(period: PeriodType, custom: { startDate: string, endDate: string }) {
    const now = new Date();
    let endDate = new Date(now);
    let startDate = new Date(now);
    let prevEnd = new Date(now);
    let prevStart = new Date(now);
    switch (period) {
      case '7j':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setDate(now.getDate() - 7);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setDate(prevEnd.getDate() - 7);
        break;
      case '30j':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setDate(now.getDate() - 30);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setDate(prevEnd.getDate() - 30);
        break;
      case '3m':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setMonth(now.getMonth() - 3);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setMonth(prevEnd.getMonth() - 3);
        break;
      case '1a':
        endDate = new Date(now);
        startDate = new Date(now); startDate.setFullYear(now.getFullYear() - 1);
        prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
        prevStart = new Date(prevEnd); prevStart.setFullYear(prevEnd.getFullYear() - 1);
        break;
      case 'custom':
        if (custom.startDate && custom.endDate) {
          startDate = new Date(custom.startDate);
          endDate = new Date(custom.endDate);
          const diff = endDate.getTime() - startDate.getTime();
          prevEnd = new Date(startDate); prevEnd.setDate(startDate.getDate() - 1);
          prevStart = new Date(prevEnd.getTime() - diff);
        }
        break;
    }
    return { prevStart, prevEnd };
  }

  const { prevStart, prevEnd } = getPreviousPeriodDates(selectedPeriod, customDateRange);
  const previousVentes = ventes.filter(v => {
    const venteDate = new Date(v.date.split('/').reverse().join('-'));
    return venteDate >= prevStart && venteDate <= prevEnd;
  });
  const previousCA = previousVentes.reduce((sum, v) => sum + v.prix, 0);
  const previousRevenus = previousVentes.reduce((sum, v) => sum + (v.prix - v.cout), 0);
  const previousMarge = previousVentes.reduce((sum, v) => sum + v.marge, 0);
  const previousVentesCount = previousVentes.length;

  // Calcul dynamique des tendances
  const tendanceCA = getTendance(totalCA, previousCA);
  const tendanceRevenu = getTendance(totalRevenus, previousRevenus);
  const tendanceVentes = getTendance(filteredVentes.length, previousVentesCount);
  const tendanceMarge = getTendance(totalRevenuNet, previousMarge);

  // Calcul du top ventes dynamique
  const ventesParArticle = filteredVentes.reduce((acc, v) => {
    acc[v.article] = (acc[v.article] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topVentesDynamiques = Object.entries(ventesParArticle)
    .map(([name, ventes]) => ({ name, ventes }))
    .sort((a, b) => b.ventes - a.ventes)
    .slice(0, 5);
  const topVente = topVentesDynamiques[0] || { name: '-', ventes: 0 };

  // Résumé rapide (mock)
  const stockCritique = stats.stockFaible + stats.stockRupture;

  // Handler pour changer de période
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setShowCustomPicker(false);
    }
  };

  // Handler pour appliquer la période personnalisée
  const handleCustomPeriodApply = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setSelectedPeriod('custom');
      setShowCustomPicker(false);
    }
  };

  // Handler Export CSV réel des ventes
  function handleExport() {
    const headers = ['ID', 'Article', 'Catégorie', 'Acheteur', 'Prix', 'Coût', 'Marge', 'Marge (%)', 'Date', 'Statut'];
    const rows = ventesData.map(v => [
      v.id,
      v.article,
      v.categorie,
      v.acheteur,
      v.prix,
      v.cout,
      v.marge,
      v.margePourcent,
      v.date,
      v.statut
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventes-vintedpro.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Handler Nouvelle vente (ouvre le modal)
  function handleNouvelleVente() {
    setModalOpen(true);
  }

  // Handler soumission du formulaire (mock)
  function handleSubmitNouvelleVente(article: Article) {
    console.log('Nouvelle vente ajoutée :', article);
  }

  // Dataset dynamique pour le graphique d'évolution financière (groupé par mois)
  const chartData = filteredVentes.reduce((acc, v) => {
    // On suppose date au format DD/MM/YYYY
    const [day, month, year] = v.date.split('/');
    const key = `${month}/${year}`;
    let entry = acc.find(e => e.month === key);
    if (!entry) {
      entry = { month: key, ca: 0, revenus: 0, marge: 0 };
      acc.push(entry);
    }
    entry.ca += v.prix;
    entry.revenus += v.prix - v.cout;
    entry.marge += v.marge;
    return acc;
  }, [] as { month: string, ca: number, revenus: number, marge: number }[]);

  // Calcul dynamique de la tendance de la marge moyenne
  const margeMoyennePrecedente = previousVentes.length > 0 ? (previousVentes.reduce((sum, v) => sum + v.margePourcent, 0) / previousVentes.length) : 0;
  const tendanceMargeMoyenne = getTendance(margeMoyenne, margeMoyennePrecedente);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard-root"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
      >
        {/* Modal de nouvelle vente */}
        <ArticleFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitNouvelleVente} />
        
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
                Tableau de bord
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Vue d'ensemble de vos performances Vinted</p>
            </div>
            <div className="flex items-center gap-3">
              <ImportVintedModal onImport={(articles) => {/* TODO: ajouter à l'inventaire */}} />
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-indigo-300"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                Exporter
              </Button>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={handleNouvelleVente}
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Nouvelle vente
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Résumé rapide */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <Star className="w-5 h-5 text-yellow-600 group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <div>
                <div className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Top vente du mois</div>
                <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{topVente.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <AlertTriangle className="w-5 h-5 text-red-600 group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <div>
                <div className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">Stock critique</div>
                <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{stockCritique} article(s)</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres de période */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg">Filtres de période</h2>
                <p className="text-slate-500 text-sm">Sélectionnez la période d'analyse</p>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
            </div>
          </div>

          {/* Boutons de période prédéfinie */}
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { type: '7j' as PeriodType, label: '7 jours' },
              { type: '30j' as PeriodType, label: '30 jours' },
              { type: '3m' as PeriodType, label: '3 mois' },
              { type: '1a' as PeriodType, label: 'Année' }
            ].map((period) => (
              <motion.button
                key={period.type}
                onClick={() => handlePeriodChange(period.type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selectedPeriod === period.type
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {period.label}
              </motion.button>
            ))}
            
            {/* Bouton période personnalisée */}
            <motion.button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 ${
                selectedPeriod === 'custom'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CalendarDays className="w-4 h-4" />
              Personnalisé
            </motion.button>
          </div>

          {/* Sélecteur de période personnalisée */}
          <AnimatePresence>
            {showCustomPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="border-t border-slate-200 pt-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
                    <input
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
                    <input
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={handleCustomPeriodApply}
                      disabled={!customDateRange.startDate || !customDateRange.endDate}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      Appliquer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomPicker(false)}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cartes de statistiques modernisées */}
        <motion.div
          key={`stats-${selectedPeriod}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Chiffre d'affaires"
            value={`${totalCA.toLocaleString()}€`}
            subtitle="Cette période"
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
            trend={`${tendanceCA >= 0 ? '+' : ''}${tendanceCA.toFixed(1)}%`}
          />
          <StatCard
            title="Revenus nets"
            value={`${totalRevenuNet.toLocaleString()}€`}
            subtitle="Après coûts"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend={`${tendanceRevenu >= 0 ? '+' : ''}${tendanceRevenu.toFixed(1)}%`}
          />
          <StatCard
            title="Ventes totales"
            value={stats.totalVentes.toString()}
            subtitle="Transactions"
            icon={<Package className="w-6 h-6" />}
            color="purple"
            trend={`${tendanceVentes >= 0 ? '+' : ''}${tendanceVentes}%`}
          />
          <StatCard
            title="Marge moyenne"
            value={margeMoyenne ? `${margeMoyenne.toFixed(1)}%` : "-"}
            subtitle="Par vente"
            icon={<Users className="w-6 h-6" />}
            color="orange"
            trend={`${tendanceMargeMoyenne >= 0 ? '+' : ''}${tendanceMargeMoyenne.toFixed(1)}%`}
          />
        </motion.div>

        {/* Graphiques et top ventes */}
        <motion.div
          key={`charts-${selectedPeriod}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Graphique d'évolution financière */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 col-span-2 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <BarChart2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Évolution financière</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">CA, revenus nets et marges de la période sélectionnée</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMarge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#6b7280' }} />
                  <Area type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCA)" name="Chiffre d'affaires" />
                  <Area type="monotone" dataKey="revenus" stroke="#34d399" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenus)" name="Revenus nets" />
                  <Area type="monotone" dataKey="marge" stroke="#a3a3a3" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMarge)" name="Marge" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 des meilleures ventes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg">Top 5 des meilleures ventes</h2>
                <p className="text-slate-500 text-sm">Articles les plus performants cette période</p>
              </div>
            </div>
            <div className="h-56 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVentesDynamiques} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-28} textAnchor="end" interval={0} height={70} tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ventes" radius={[8, 8, 0, 0]}>
                    {topVentesDynamiques.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {topVentesDynamiques.map((vente, idx) => {
                // Chercher la catégorie et le prix de l'article dans filteredVentes
                const venteInfos = filteredVentes.find(v => v.article === vente.name);
                return (
                  <TopSale
                    key={vente.name}
                    index={idx + 1}
                    name={vente.name}
                    category={venteInfos?.categorie || "-"}
                    value={venteInfos ? `${venteInfos.prix}€` : "-"}
                    sales={vente.ventes}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({ title, value, subtitle, icon, color, trend }: { 
  title: string, 
  value: string, 
  subtitle: string, 
  icon: React.ReactNode,
  color: string,
  trend: string
}) {
  const isPositive = trend.startsWith('+');
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
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
          <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <ArrowDownRight className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            )}
            <span className="font-semibold group-hover:scale-110 transition-transform duration-200">{trend}</span>
          </div>
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

function TopSale({ index, name, category, value, sales }: { index: number, name: string, category: string, value: string, sales: number }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer group">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 group-hover:scale-110 transition-transform duration-200">
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{name}</div>
        <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">{category}</div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{value}</div>
        <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">{sales} ventes</div>
      </div>
    </div>
  );
} 