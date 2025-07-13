"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Calendar, Plus, Download, Filter, X, Check, AlertCircle, Clock, Truck, TrendingUp, DollarSign, Package, Users, Search, ArrowUpDown, Eye, Edit, Trash2, BarChart3, Sparkles, PieChart, LineChart, Activity } from "lucide-react";
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
    
    const nouvelleVenteComplete = {
      article: nouvelleVente.article,
      categorie: nouvelleVente.categorie,
      acheteur: nouvelleVente.acheteur,
      prix,
      cout,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec titre et actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ventes
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Gérez vos ventes et suivez vos performances</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={exporterCSV} 
              variant="outline" 
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white"
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button 
              onClick={() => setModalOuvert(true)} 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Nouvelle vente
            </Button>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {messageSucces && <Toast message={messageSucces} type="success" />}

      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ventes totales"
          value={stats.ventesTotales != null ? stats.ventesTotales.toString() : '0'}
          subtitle="Cette période"
          icon={<Package className="w-6 h-6" />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={stats.chiffreAffaires != null ? stats.chiffreAffaires.toFixed(0) + '€' : '0€'}
          subtitle="Total des ventes"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Revenu net"
          value={stats.revenuNet != null ? stats.revenuNet.toFixed(0) + '€' : '0€'}
          subtitle="Après coût d'achat"
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
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
      </div>

      {/* Section des graphiques */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">Analyses et graphiques</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique d'évolution des ventes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="h-80">
              <Line data={donneesGraphiques.evolutionVentes} options={optionsEvolution} />
            </div>
          </div>

          {/* Graphique de répartition par catégorie */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="h-80">
              <Doughnut data={donneesGraphiques.repartitionCategories} options={optionsRepartition} />
            </div>
          </div>

          {/* Graphique de performance des marges */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
            <div className="h-80">
              <Bar data={donneesGraphiques.performanceMarges} options={optionsPerformance} />
            </div>
          </div>
        </div>
      </div>

      {/* Section filtres et recherche */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filtres et recherche</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reinitialiserFiltres}
              className="text-slate-600 hover:text-slate-800"
            >
              Réinitialiser
            </Button>
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
      </div>

      {/* Tableau des ventes modernisé */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
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
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 text-lg">Aucune vente trouvée</p>
                      <p className="text-slate-400 text-sm">Essayez d'ajuster vos filtres ou d'ajouter une nouvelle vente</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ventesPage.map((vente, index) => (
                  <tr
                    key={vente.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{vente.article}</div>
                          <div className="text-xs text-slate-500">ID: {vente.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vente.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-2">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-900">{vente.acheteur}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{vente.prix}€</div>
                      <div className="text-xs text-slate-500">Coût: {vente.cout}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-green-600">{vente.marge}€</div>
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {vente.margePourcent.toFixed(1)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vente.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge statut={vente.statut} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination modernisée */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
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
          </div>
        )}
      </div>

      {/* Modal Nouvelle Vente modernisé */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 animate-fade-in shadow-2xl">
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
          </div>
        </div>
      )}
    </div>
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
  const colorMap: any = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ statut }: { statut: string }) {
  const colorMap: any = {
    "En cours": "bg-yellow-100 text-yellow-800 border border-yellow-300",
    "Expédié": "bg-blue-100 text-blue-800 border border-blue-300",
    "Livré": "bg-green-100 text-green-800 border border-green-300",
  };
  const iconMap: any = {
    "En cours": <Clock className="w-3.5 h-3.5 mr-1" />,
    "Expédié": <Truck className="w-3.5 h-3.5 mr-1" />,
    "Livré": <Check className="w-3.5 h-3.5 mr-1" />,
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full gap-1 ${colorMap[statut] || "bg-gray-100 text-gray-800 border border-gray-300"}`}
    >
      {iconMap[statut]}
      {statut}
    </span>
  );
}

function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-fade-in backdrop-blur-sm ${
        type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span className="font-medium">{message}</span>
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