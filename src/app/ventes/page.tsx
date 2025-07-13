"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Calendar, Plus, Download, Filter, X, Check, AlertCircle, Clock, Truck, TrendingUp, DollarSign, Package, Users, Search, ArrowUpDown, Eye, Edit, Trash2, BarChart3, Sparkles, PieChart, LineChart, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from "framer-motion";

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types pour les ventes
interface Vente {
  id: number;
  article: string;
  categorie: string;
  acheteur: string;
  prix: number;
  cout: number;
  marge: number;
  margePourcent: number;
  date: string;
  statut: "Livré" | "Expédié" | "En cours";
}

const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
const statuts = ["Tous", "En cours", "Expédié", "Livré"];

export default function VentesPage() {
  const { ventes, addVente } = useData();
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [pageCourante, setPageCourante] = useState(1);
  const [elementsParPage, setElementsParPage] = useState(10);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [nouvelleVente, setNouvelleVente] = useState<{
    article: string;
    categorie: string;
    acheteur: string;
    prix: string;
    cout: string;
    date: string;
    statut: "En cours" | "Expédié" | "Livré";
  }>({
    article: "",
    categorie: "Vêtements",
    acheteur: "",
    prix: "",
    cout: "",
    date: new Date().toISOString().split('T')[0],
    statut: "En cours",
  });
  const [erreurs, setErreurs] = useState<{[key: string]: string}>({});
  const [messageSucces, setMessageSucces] = useState("");

  // Filtrage des ventes
  const ventesFiltrees = ventes.filter((vente) => {
    const matchCategorie = filtreCategorie === "Toutes" || vente.categorie === filtreCategorie;
    const matchStatut = filtreStatut === "Tous" || vente.statut === filtreStatut;
    const matchRecherche = vente.article.toLowerCase().includes(recherche.toLowerCase()) ||
                          vente.acheteur.toLowerCase().includes(recherche.toLowerCase());
    const matchDate = (!dateDebut || vente.date >= dateDebut) && (!dateFin || vente.date <= dateFin);
    const matchPrix = (!prixMin || vente.prix >= parseFloat(prixMin)) && (!prixMax || vente.prix <= parseFloat(prixMax));
    
    return matchCategorie && matchStatut && matchRecherche && matchDate && matchPrix;
  });

  // Pagination
  const indexDebut = (pageCourante - 1) * elementsParPage;
  const indexFin = indexDebut + elementsParPage;
  const ventesPage = ventesFiltrees.slice(indexDebut, indexFin);
  const totalPages = Math.ceil(ventesFiltrees.length / elementsParPage);

  // Calcul des statistiques
  const stats = {
    ventesTotales: ventesFiltrees.length,
    chiffreAffaires: ventesFiltrees.reduce((sum, v) => sum + v.prix, 0),
    margeTotale: ventesFiltrees.reduce((sum, v) => sum + v.marge, 0),
    panierMoyen: ventesFiltrees.length > 0 ? ventesFiltrees.reduce((sum, v) => sum + v.prix, 0) / ventesFiltrees.length : 0,
    revenuNet: ventesFiltrees.reduce((sum, v) => sum + v.marge, 0),
  };

  // Validation du formulaire
  const validerFormulaire = () => {
    const nouvellesErreurs: {[key: string]: string} = {};
    
    if (!nouvelleVente.article.trim()) nouvellesErreurs.article = "L'article est requis";
    if (!nouvelleVente.acheteur.trim()) nouvellesErreurs.acheteur = "L'acheteur est requis";
    if (!nouvelleVente.prix || parseFloat(nouvelleVente.prix) <= 0) nouvellesErreurs.prix = "Le prix doit être positif";
    if (!nouvelleVente.cout || parseFloat(nouvelleVente.cout) < 0) nouvellesErreurs.cout = "Le coût doit être positif ou nul";
    if (parseFloat(nouvelleVente.cout) > parseFloat(nouvelleVente.prix)) nouvellesErreurs.cout = "Le coût ne peut pas dépasser le prix";
    
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  // Ajouter une nouvelle vente
  const ajouterVente = () => {
    if (!validerFormulaire()) return;

    const prix = parseFloat(nouvelleVente.prix);
    const cout = parseFloat(nouvelleVente.cout);
    const marge = prix - cout;
    const margePourcent = prix > 0 ? (marge / prix) * 100 : 0;

    const nouvelleVenteComplete = {
      article: nouvelleVente.article,
      categorie: nouvelleVente.categorie,
      acheteur: nouvelleVente.acheteur,
      prix,
      cout,
      marge,
      margePourcent,
      date: nouvelleVente.date,
      statut: nouvelleVente.statut,
    };
    
    addVente(nouvelleVenteComplete);
    setModalOuvert(false);
    setNouvelleVente({
      article: "",
      categorie: "Vêtements",
      acheteur: "",
      prix: "",
      cout: "",
      date: new Date().toISOString().split('T')[0],
      statut: "En cours",
    });
    setErreurs({});
    setMessageSucces("Vente ajoutée avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
    setPageCourante(1);
  };

  // Export CSV
  const exporterCSV = () => {
    const headers = ["Article", "Catégorie", "Acheteur", "Prix", "Coût", "Marge", "Marge %", "Date", "Statut"];
    const csvContent = [
      headers.join(","),
      ...ventesFiltrees.map(v => [
        `"${v.article}"`,
        v.categorie,
        `"${v.acheteur}"`,
        v.prix,
        v.cout,
        v.marge,
        `${v.margePourcent.toFixed(1)}%`,
        v.date,
        v.statut
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ventes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Réinitialiser les filtres
  const reinitialiserFiltres = () => {
    setFiltreCategorie("Toutes");
    setFiltreStatut("Tous");
    setRecherche("");
    setDateDebut("");
    setDateFin("");
    setPrixMin("");
    setPrixMax("");
    setPageCourante(1);
  };

  // Données pour les graphiques
  const donneesGraphiques = useMemo(() => {
    // Évolution des ventes par mois
    const ventesParMois = ventesFiltrees.reduce((acc, vente) => {
      const mois = new Date(vente.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      if (!acc[mois]) {
        acc[mois] = { ventes: 0, chiffreAffaires: 0, marge: 0 };
      }
      acc[mois].ventes += 1;
      acc[mois].chiffreAffaires += vente.prix;
      acc[mois].marge += vente.marge;
      return acc;
    }, {} as Record<string, { ventes: number; chiffreAffaires: number; marge: number }>);

    const mois = Object.keys(ventesParMois).slice(-6); // 6 derniers mois
    const ventesParMoisData = mois.map(m => ventesParMois[m]?.ventes || 0);
    const chiffreAffairesParMois = mois.map(m => ventesParMois[m]?.chiffreAffaires || 0);
    const margeParMois = mois.map(m => ventesParMois[m]?.marge || 0);

    // Répartition par catégorie
    const repartitionCategories = ventesFiltrees.reduce((acc, vente) => {
      acc[vente.categorie] = (acc[vente.categorie] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Performance des marges
    const margesParCategorie = ventesFiltrees.reduce((acc, vente) => {
      if (!acc[vente.categorie]) {
        acc[vente.categorie] = { margeTotale: 0, nombreVentes: 0 };
      }
      acc[vente.categorie].margeTotale += vente.marge;
      acc[vente.categorie].nombreVentes += 1;
      return acc;
    }, {} as Record<string, { margeTotale: number; nombreVentes: number }>);

    const categoriesLabels = Object.keys(margesParCategorie);
    const margesMoyennes = categoriesLabels.map(cat => 
      margesParCategorie[cat].margeTotale / margesParCategorie[cat].nombreVentes
    );

    return {
      evolutionVentes: {
        labels: mois,
        datasets: [
          {
            label: 'Nombre de ventes',
            data: ventesParMoisData,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Chiffre d\'affaires (€)',
            data: chiffreAffairesParMois,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y1',
          }
        ]
      },
      repartitionCategories: {
        labels: Object.keys(repartitionCategories),
        datasets: [{
          data: Object.values(repartitionCategories),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        }]
      },
      performanceMarges: {
        labels: categoriesLabels,
        datasets: [{
          label: 'Marge moyenne (€)',
          data: margesMoyennes,
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          borderRadius: 8,
        }]
      }
    };
  }, [ventesFiltrees]);

  // Options des graphiques
  const optionsEvolution = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Évolution des ventes',
        font: { size: 16, weight: 'bold' as const }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Nombre de ventes'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Chiffre d\'affaires (€)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const optionsRepartition = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Répartition par catégorie',
        font: { size: 16, weight: 'bold' as const }
      }
    }
  };

  const optionsPerformance = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Performance des marges par catégorie',
        font: { size: 16, weight: 'bold' as const }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Marge moyenne (€)'
        }
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ventes-page"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
      >
        {/* Header avec titre et actions (style Dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ventes
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Suivez et gérez vos transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-indigo-300"
                onClick={exporterCSV}
              >
                <Download className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                Exporter
              </Button>
              <Button 
                onClick={() => setModalOuvert(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Nouvelle vente
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Message de succès */}
        <AnimatePresence>
          {messageSucces && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Toast message={messageSucces} type="success" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* StatCards avec style Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Ventes totales"
            value={stats.ventesTotales != null ? stats.ventesTotales.toString() : '0'}
            subtitle="Cette période"
            icon={<Package className="w-6 h-6" />}
            color="purple"
            trend="+12%"
          />
          <StatCard
            title="Chiffre d'affaires"
            value={stats.chiffreAffaires != null ? stats.chiffreAffaires.toFixed(0) + '€' : '0€'}
            subtitle="Total des ventes"
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
            trend="+8%"
          />
          <StatCard
            title="Revenu net"
            value={stats.revenuNet != null ? stats.revenuNet.toFixed(0) + '€' : '0€'}
            subtitle="Après coût d'achat"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend="+15%"
          />
          <StatCard
            title="Panier moyen"
            value={stats.panierMoyen != null ? stats.panierMoyen.toFixed(0) + '€' : '0€'}
            subtitle="Par vente"
            icon={<Users className="w-6 h-6" />}
            color="orange"
            trend="+5%"
          />
        </motion.div>

        {/* Section des graphiques avec style Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
              <BarChart3 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Analyses et graphiques</h2>
              <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Évolution et répartition de vos ventes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Graphique d'évolution des ventes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              <div className="h-80">
                <Line data={donneesGraphiques.evolutionVentes} options={optionsEvolution} />
              </div>
            </div>

            {/* Graphique de répartition par catégorie */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
              <div className="h-80">
                <Doughnut data={donneesGraphiques.repartitionCategories} options={optionsRepartition} />
              </div>
            </div>

            {/* Graphique de performance des marges */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 lg:col-span-2">
              <div className="h-80">
                <Bar data={donneesGraphiques.performanceMarges} options={optionsPerformance} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section filtres avec style Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                <Filter className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 text-lg group-hover:text-slate-900 transition-colors duration-200">Filtres et recherche</h2>
                <p className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">Affinez vos résultats</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={reinitialiserFiltres}
                className="text-slate-600 hover:text-slate-800 hover:scale-105 transition-all duration-200"
              >
                Réinitialiser
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFiltresOuverts(!filtresOuverts)}
                className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
              >
                {filtresOuverts ? "Masquer" : "Afficher"} les filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${filtresOuverts ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Barre de recherche principale */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par article ou acheteur..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Filtres avancés */}
          {filtresOuverts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                <select
                  value={filtreCategorie}
                  onChange={(e) => setFiltreCategorie(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <select
                  value={filtreStatut}
                  onChange={(e) => setFiltreStatut(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {statuts.map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix min (€)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={prixMin}
                  onChange={(e) => setPrixMin(e.target.value)}
                  className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix max (€)</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={prixMax}
                  onChange={(e) => setPrixMax(e.target.value)}
                  className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Tableau avec style Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Liste des ventes</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Lignes par page:</span>
                <select
                  value={elementsParPage}
                  onChange={(e) => {
                    setElementsParPage(parseInt(e.target.value));
                    setPageCourante(1);
                  }}
                  className="px-2 py-1 bg-white/50 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Article</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acheteur</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Prix</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Marge</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {ventesPage.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                        >
                          <Package className="w-12 h-12 text-slate-300" />
                        </motion.div>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                          className="text-slate-500 text-lg"
                        >
                          Aucune vente trouvée
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                          className="text-slate-400 text-sm"
                        >
                          Essayez d'ajuster vos filtres ou d'ajouter une nouvelle vente
                        </motion.p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  ventesPage.map((vente, index) => (
                    <motion.tr
                      key={vente.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.5, 
                        ease: "easeOut" 
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "rgba(99, 102, 241, 0.02)",
                        transition: { duration: 0.2 }
                      }}
                      className="group relative overflow-hidden"
                    >
                      {/* Effet de shimmer au hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
                      
                      <td className="px-6 py-4 relative z-10">
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div 
                            className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Package className="w-5 h-5 text-indigo-600" />
                          </motion.div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{vente.article}</div>
                            <div className="text-xs text-slate-500">ID: {vente.id}</div>
                          </div>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.span 
                          className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {vente.categorie}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div 
                            className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-2"
                            whileHover={{ rotate: -5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Users className="w-4 h-4 text-green-600" />
                          </motion.div>
                          <span className="text-sm text-slate-900">{vente.acheteur}</span>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.div 
                          className="text-sm font-semibold text-slate-900"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {vente.prix}€
                        </motion.div>
                        <div className="text-xs text-slate-500">Coût: {vente.cout}€</div>
                      </td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.div 
                          className="flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm font-semibold text-green-600">{vente.marge}€</div>
                          <motion.div 
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            {vente.margePourcent.toFixed(1)}%
                          </motion.div>
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 relative z-10">{vente.date}</td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <StatusBadge statut={vente.statut} />
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 relative z-10">
                        <motion.div 
                          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0, x: 10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.button 
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            className="p-2 text-slate-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination modernisée */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="px-6 py-4 border-t border-slate-200 bg-slate-50/50"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Affichage de {indexDebut + 1} à {Math.min(indexFin, ventesFiltrees.length)} sur {ventesFiltrees.length} résultats
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageCourante(pageCourante - 1)}
                    disabled={pageCourante === 1}
                    className="bg-white/50 border-slate-200 hover:bg-white"
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-slate-700 px-3 py-1 bg-white rounded-lg border border-slate-200">
                    Page {pageCourante} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageCourante(pageCourante + 1)}
                    disabled={pageCourante === totalPages}
                    className="bg-white/50 border-slate-200 hover:bg-white"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Modal Nouvelle Vente modernisé */}
        <AnimatePresence>
          {modalOuvert && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setModalOuvert(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">Nouvelle vente</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalOuvert(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Article */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Article *</label>
                    <Input
                      value={nouvelleVente.article}
                      onChange={(e) => setNouvelleVente({...nouvelleVente, article: e.target.value})}
                      placeholder="Nom de l'article"
                      className={`bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${erreurs.article ? "border-red-500" : ""}`}
                    />
                    {erreurs.article && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {erreurs.article}
                      </div>
                    )}
                  </div>

                  {/* Catégorie et Acheteur */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                      <select
                        value={nouvelleVente.categorie}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, categorie: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {categories.slice(1).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Acheteur *</label>
                      <Input
                        value={nouvelleVente.acheteur}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, acheteur: e.target.value})}
                        placeholder="Nom de l'acheteur"
                        className={`bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${erreurs.acheteur ? "border-red-500" : ""}`}
                      />
                      {erreurs.acheteur && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {erreurs.acheteur}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prix et Coût */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Prix (€) *</label>
                      <Input
                        type="number"
                        value={nouvelleVente.prix}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, prix: e.target.value})}
                        placeholder="0.00"
                        className={`bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${erreurs.prix ? "border-red-500" : ""}`}
                      />
                      {erreurs.prix && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {erreurs.prix}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Coût (€)</label>
                      <Input
                        type="number"
                        value={nouvelleVente.cout}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, cout: e.target.value})}
                        placeholder="0.00"
                        className={`bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${erreurs.cout ? "border-red-500" : ""}`}
                      />
                      {erreurs.cout && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {erreurs.cout}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date et Statut */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <Input
                        type="date"
                        value={nouvelleVente.date}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, date: e.target.value})}
                        className="bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                      <select
                        value={nouvelleVente.statut}
                        onChange={(e) => setNouvelleVente({...nouvelleVente, statut: e.target.value as "En cours" | "Expédié" | "Livré"})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {statuts.slice(1).map((stat) => (
                          <option key={stat} value={stat}>{stat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setModalOuvert(false)}
                    className="flex-1 bg-slate-50 border-slate-200 hover:bg-slate-100"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={ajouterVente}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    Ajouter la vente
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// Composants modernisés
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

function StatusBadge({ statut }: { statut: string }) {
  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case "En cours":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-3 h-3" />,
          shadow: "0 0 0 6px rgba(253,224,71,0.18)" // jaune glow
        };
      case "Expédié":
        return {
          bg: "bg-blue-100 text-blue-800",
          icon: <Truck className="w-3 h-3" />,
          shadow: "0 0 0 6px rgba(59,130,246,0.18)" // bleu glow
        };
      case "Livré":
        return {
          bg: "bg-green-100 text-green-800",
          icon: <Check className="w-3 h-3" />,
          shadow: "0 0 0 6px rgba(34,197,94,0.18)" // vert glow
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-600",
          icon: <AlertCircle className="w-3 h-3" />,
          shadow: "0 0 0 6px rgba(100,116,139,0.12)" // gris glow
        };
    }
  };
  const { bg, icon, shadow } = getStatusConfig(statut);
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${bg}`} style={{ boxShadow: shadow }}>
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "currentColor", boxShadow: shadow }}></span>
      {icon}
      {statut}
    </span>
  );
}

function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
      {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{message}</span>
    </div>
  );
}

// Styles CSS pour les animations
<style jsx global>{`
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(.4,0,.2,1);
}
`}</style> 