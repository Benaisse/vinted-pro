'use client'

import { Button } from "@/components/ui/button";
import { BarChart2, Calendar, ChevronDown } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend
} from "recharts";
import React from "react";

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
      <div className="bg-white rounded-lg shadow-lg px-4 py-2 border text-xs">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }}></span>
            <span>{entry.name} :</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble de vos performances Vinted</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-4 items-center">
        <Filter label="Période" icon={<Calendar className="w-4 h-4 mr-2" />} />
        <Filter label="Catégorie" />
        <Filter label="Statut" />
        <Filter label="Gamme de prix" />
        <div className="flex-1" />
        <Button variant="outline" className="text-sm">Exporter</Button>
        <Button className="text-sm">+ Nouvelle vente</Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard color="blue" title="Chiffre d'affaires" value="25,847€" subtitle="+12.5% vs mois dernier" icon={<BarChart2 className="w-5 h-5" />} />
        <StatCard color="green" title="Revenus nets" value="20,678€" subtitle="Marge: 80%" icon={<BarChart2 className="w-5 h-5" />} />
        <StatCard color="purple" title="Ventes totales" value="342" subtitle="+23 cette semaine" icon={<BarChart2 className="w-5 h-5" />} />
        <StatCard color="orange" title="Marge moyenne" value="78.5%" subtitle="+3.2% vs mois dernier" icon={<BarChart2 className="w-5 h-5" />} />
      </div>

      {/* Graphiques et top ventes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique d'évolution financière */}
        <div className="bg-white rounded-xl border p-4 col-span-2">
          <h2 className="font-semibold text-gray-900 mb-1 text-base">Évolution financière</h2>
          <p className="text-xs text-gray-500 mb-4">CA, revenus nets et marges des 6 derniers mois</p>
          <div className="h-72 w-full">
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
        <div className="bg-white rounded-xl border p-4">
          <h2 className="font-semibold text-gray-900 mb-1 text-base">Top 5 des meilleures ventes</h2>
          <p className="text-xs text-gray-500 mb-4">Articles les plus performants ce mois-ci</p>
          <div className="h-56 w-full mb-4">
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
          <ol className="space-y-2">
            <TopSale index={1} name="Robe Zara fleurie" category="Vêtements" value="300€" sales={12} />
            <TopSale index={2} name="Sneakers Nike Air Max" category="Chaussures" value="520€" sales={8} />
            <TopSale index={3} name="Sac Longchamp" category="Sacs" value="270€" sales={6} />
            <TopSale index={4} name="Jean Levi's 501" category="Vêtements" value="175€" sales={5} />
            <TopSale index={5} name="Montre Daniel Wellington" category="Accessoires" value="320€" sales={4} />
          </ol>
        </div>
      </div>
    </div>
  );
}

function Filter({ label, icon }: { label: string, icon?: React.ReactNode }) {
  return (
    <Button variant="outline" className="flex items-center text-sm font-normal">
      {icon}
      {label}
      <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
  );
}

function StatCard({ color, title, value, subtitle, icon }: { color: string, title: string, value: string, subtitle: string, icon: React.ReactNode }) {
  const colorMap: any = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-600 text-white",
    orange: "bg-orange-500 text-white",
  };
  return (
    <div className={"rounded-xl p-4 flex flex-col gap-2 " + colorMap[color] + " shadow-sm"}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{title}</span>
        <span>{icon}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs opacity-80">{subtitle}</span>
    </div>
  );
}

function TopSale({ index, name, category, value, sales }: { index: number, name: string, category: string, value: string, sales: number }) {
  const colors = ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-600", "bg-gray-100 text-gray-600"];
  return (
    <li className="flex items-center gap-2">
      <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs ${colors[index-1]}`}>{index}</span>
      <div className="flex-1">
        <span className="font-medium text-gray-900 text-sm">{name}</span>
        <span className="block text-xs text-gray-400">{category}</span>
      </div>
      <span className="font-bold text-gray-700 text-sm mr-2">{value}</span>
      <span className="text-xs text-gray-400">{sales} ventes</span>
    </li>
  );
} 