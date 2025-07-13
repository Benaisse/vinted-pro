'use client'

import { Button } from "@/components/ui/button";
import { BarChart2, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, AlertTriangle, Star, TrendingUp, DollarSign, Package, Users, Plus, Download, Filter as FilterIcon, Sparkles } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend
} from "recharts";
import React from "react";
import { useData } from "@/contexts/DataContext";
import { ventes as ventesData } from "@/data/ventes";
import { ArticleFormModal, Article } from "@/components/ArticleFormModal";

const financialData = [
  { month: "Jan", ca: 2000, revenus: 1500, marge: 400 },
  { month: "Fév", ca: 4000, revenus: 3000, marge: 800 },
  { month: "Mar", ca: 4500, revenus: 3200, marge: 900 },
  { month: "Avr", ca: 2500, revenus: 2000, marge: 600 },
  { month: "Mai", ca: 7000, revenus: 5000, marge: 1200 },
  { month: "Juin", ca: 5000, revenus: 4000, marge: 900 },
];

const topSalesData = [
  { name: "Robe Zara fleurie", ventes: 320 },
  { name: "Sneakers Nike Air Max", ventes: 540 },
  { name: "Sac Longchamp", ventes: 300 },
  { name: "Jean Levi's 501", ventes: 180 },
  { name: "Montre Daniel Wellington", ventes: 350 },
];

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
  const { stats } = useData();
  const [modalOpen, setModalOpen] = React.useState(false);
  
  const totalRevenuNet = financialData.reduce((sum, d) => sum + d.marge, 0);
  // Exemples de tendances (mock)
  const tendanceCA = 12.5;
  const tendanceRevenu = 8.2;
  const tendanceVentes = -3.1;
  const tendanceMarge = 2.7;
  // Résumé rapide (mock)
  const topVente = topSalesData[0];
  const stockCritique = stats.stockFaible + stats.stockRupture;

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
    // Ici, on pourrait ajouter à un contexte ou faire un appel API
    console.log('Nouvelle vente ajoutée :', article);
    // TODO: Ajouter au contexte global ou recharger les données
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Modal de nouvelle vente */}
      <ArticleFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitNouvelleVente} />
      {/* Header avec titre et actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de bord
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Vue d'ensemble de vos performances Vinted</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleNouvelleVente}
            >
              <Plus className="w-4 h-4" />
              Nouvelle vente
            </Button>
          </div>
        </div>
      </div>

      {/* Résumé rapide */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-slate-600 text-sm">Top vente du mois</div>
              <div className="font-semibold text-slate-800">{topVente.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-slate-600 text-sm">Stock critique</div>
              <div className="font-semibold text-slate-800">{stockCritique} article(s)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <Filter label="Période" icon={<Calendar className="w-4 h-4 mr-2" />} />
          <Filter label="Catégorie" />
          <Filter label="Statut" />
          <Filter label="Gamme de prix" />
        </div>
      </div>

      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Chiffre d'affaires"
          value="25,847€"
          subtitle="Cette période"
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
          trend={`+${tendanceCA}%`}
        />
        <StatCard
          title="Revenus nets"
          value={`${totalRevenuNet.toLocaleString()}€`}
          subtitle="Après coûts"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={`+${tendanceRevenu}%`}
        />
        <StatCard
          title="Ventes totales"
          value={stats.totalVentes.toString()}
          subtitle="Transactions"
          icon={<Package className="w-6 h-6" />}
          color="purple"
          trend={`${tendanceVentes}%`}
        />
        <StatCard
          title="Marge moyenne"
          value="78.5%"
          subtitle="Par vente"
          icon={<Users className="w-6 h-6" />}
          color="orange"
          trend={`+${tendanceMarge}%`}
        />
      </div>

      {/* Graphiques et top ventes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique d'évolution financière */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 col-span-2 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-lg">Évolution financière</h2>
              <p className="text-slate-500 text-sm">CA, revenus nets et marges des 6 derniers mois</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
              <p className="text-slate-500 text-sm">Articles les plus performants ce mois-ci</p>
            </div>
          </div>
          <div className="h-56 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSalesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-28} textAnchor="end" interval={0} height={70} tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ventes" radius={[8, 8, 0, 0]}>
                  {topSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <TopSale index={1} name="Robe Zara fleurie" category="Vêtements" value="300€" sales={12} />
            <TopSale index={2} name="Sneakers Nike Air Max" category="Chaussures" value="520€" sales={8} />
            <TopSale index={3} name="Sac Longchamp" category="Sacs" value="270€" sales={6} />
            <TopSale index={4} name="Jean Levi's 501" category="Vêtements" value="175€" sales={5} />
            <TopSale index={5} name="Montre Daniel Wellington" category="Accessoires" value="320€" sales={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Filter({ label, icon }: { label: string, icon?: React.ReactNode }) {
  return (
    <Button variant="outline" className="flex items-center text-sm font-normal bg-white/50 border-slate-200 hover:bg-white">
      {icon}
      {label}
      <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
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
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  const isPositive = trend.startsWith('+');

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
      <div className="flex items-center gap-1 mt-3">
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3 text-green-500" />
        ) : (
          <ArrowDownRight className="w-3 h-3 text-red-500" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function TopSale({ index, name, category, value, sales }: { index: number, name: string, category: string, value: string, sales: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors duration-200">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600">
        {index}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 truncate">{name}</div>
        <div className="text-sm text-slate-500">{category}</div>
      </div>
      <div className="text-right">
        <div className="font-medium text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{sales} ventes</div>
      </div>
    </div>
  );
} 