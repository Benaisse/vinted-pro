"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stock as stockData } from "@/data/stock";
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, DollarSign, AlertCircle, Edit, Plus as PlusIcon, Minus as MinusIcon, RefreshCw, ChevronDown, X, Check, Clock, Truck, Users, BarChart3, Sparkles } from "lucide-react";

interface StockItem {
  id: number;
  nom: string;
  categorie: string;
  quantite: number;
  seuilAlerte: number;
  prixUnitaire: number;
  valeurTotale: number;
  statut: "Normal" | "Faible" | "Rupture";
  derniereMiseAJour: string;
}

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>(stockData);
  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [elementsParPage, setElementsParPage] = useState(10);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [itemEnEdition, setItemEnEdition] = useState<StockItem | null>(null);
  const [nouvelleQuantite, setNouvelleQuantite] = useState("");
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");

  // Filtrage du stock
  const stockFiltre = useMemo(() => {
    return stock.filter((item) => {
      const matchRecherche = item.nom.toLowerCase().includes(recherche.toLowerCase());
      const matchCategorie = filtreCategorie === "Toutes" || item.categorie === filtreCategorie;
      const matchStatut = filtreStatut === "Tous" || item.statut === filtreStatut;
      
      return matchRecherche && matchCategorie && matchStatut;
    });
  }, [stock, recherche, filtreCategorie, filtreStatut]);

  // Pagination
  const indexDebut = (pageCourante - 1) * elementsParPage;
  const indexFin = indexDebut + elementsParPage;
  const stockPage = stockFiltre.slice(indexDebut, indexFin);
  const totalPages = Math.ceil(stockFiltre.length / elementsParPage);

  // Statistiques
  const stats = useMemo(() => {
    const total = stock.length;
    const normal = stock.filter(s => s.statut === "Normal").length;
    const faible = stock.filter(s => s.statut === "Faible").length;
    const rupture = stock.filter(s => s.statut === "Rupture").length;
    const valeurTotale = stock.reduce((sum, s) => sum + s.valeurTotale, 0);
    const quantiteTotale = stock.reduce((sum, s) => sum + s.quantite, 0);

    return { total, normal, faible, rupture, valeurTotale, quantiteTotale };
  }, [stock]);

  // Alertes
  const alertes = useMemo(() => {
    return stock.filter(item => item.statut === "Faible" || item.statut === "Rupture");
  }, [stock]);

  // Gestion du stock
  const modifierQuantite = (id: number, nouvelleQuantite: number) => {
    setStock(prev => prev.map(item => {
      if (item.id === id) {
        const quantite = Math.max(0, nouvelleQuantite);
        let statut: "Normal" | "Faible" | "Rupture" = "Normal";
        if (quantite === 0) statut = "Rupture";
        else if (quantite <= item.seuilAlerte) statut = "Faible";
        
        return {
          ...item,
          quantite,
          valeurTotale: quantite * item.prixUnitaire,
          statut,
          derniereMiseAJour: new Date().toLocaleDateString('fr-FR')
        };
      }
      return item;
    }));
    setMessageSucces("Stock mis à jour avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const ajouterQuantite = (id: number) => {
    const item = stock.find(s => s.id === id);
    if (item) {
      modifierQuantite(id, item.quantite + 1);
    }
  };

  const retirerQuantite = (id: number) => {
    const item = stock.find(s => s.id === id);
    if (item) {
      modifierQuantite(id, item.quantite - 1);
    }
  };

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreCategorie("Toutes");
    setFiltreStatut("Tous");
    setPageCourante(1);
  };

  const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
  const statuts = ["Tous", "Normal", "Faible", "Rupture"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec titre et actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stock
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Gérez vos stocks et alertes</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setModalOuvert(true)} 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Ajouter un article
            </Button>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {messageSucces && <Toast message={messageSucces} type="success" />}

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-800 text-lg">Alertes de stock</h3>
              <p className="text-orange-600 text-sm">{alertes.length} article(s) nécessitent votre attention</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertes.slice(0, 5).map(item => (
              <span key={item.id} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                <Package className="w-3 h-3" />
                {item.nom} ({item.quantite} restant{item.quantite > 1 ? 's' : ''})
              </span>
            ))}
            {alertes.length > 5 && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                +{alertes.length - 5} autre(s)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total articles"
          value={stats.total.toString()}
          subtitle="En stock"
          icon={<Package className="w-6 h-6" />}
          color="blue"
          trend="+3%"
        />
        <StatCard
          title="Stock normal"
          value={stats.normal.toString()}
          subtitle="Articles disponibles"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Valeur totale"
          value={`${stats.valeurTotale.toFixed(0)}€`}
          subtitle="Stock disponible"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          trend="+12%"
        />
        <StatCard
          title="Quantité totale"
          value={stats.quantiteTotale.toString()}
          subtitle="Unités en stock"
          icon={<Package className="w-6 h-6" />}
          color="orange"
          trend="+5%"
        />
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
            placeholder="Rechercher par nom d'article..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10 bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Filtres avancés */}
        {filtresOuverts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
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
                {statuts.map((statut) => (
                  <option key={statut} value={statut}>{statut}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tableau du stock modernisé */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Liste du stock</h3>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Prix unitaire</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valeur totale</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {stockPage.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 text-lg">Aucun article trouvé</p>
                      <p className="text-slate-400 text-sm">Essayez d'ajuster vos filtres ou d'ajouter un nouvel article</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stockPage.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{item.nom}</div>
                          <div className="text-sm text-slate-500">Seuil: {item.seuilAlerte}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{item.quantite}</div>
                      <div className="text-sm text-slate-500">Dernière MAJ: {item.derniereMiseAJour}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{item.prixUnitaire}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{item.valeurTotale}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <StockStatusBadge statut={item.statut} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => ajouterQuantite(item.id)}
                          className="text-slate-600 hover:text-green-600 hover:bg-green-50"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retirerQuantite(item.id)}
                          className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setItemEnEdition(item)}
                          className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage de {indexDebut + 1} à {Math.min(indexFin, stockFiltre.length)} sur {stockFiltre.length} articles
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageCourante(pageCourante - 1)}
                  disabled={pageCourante === 1}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pageCourante ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPageCourante(page)}
                      className={page === pageCourante ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-800"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageCourante(pageCourante + 1)}
                  disabled={pageCourante === totalPages}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Composants utilitaires
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
        <TrendingUp className="w-3 h-3 text-green-500" />
        <span className="text-xs text-green-600 font-medium">{trend}</span>
      </div>
    </div>
  );
}

function StockStatusBadge({ statut }: { statut: string }) {
  const config = {
    "Normal": { color: "bg-green-100 text-green-800", icon: <Check className="w-3 h-3" /> },
    "Faible": { color: "bg-orange-100 text-orange-800", icon: <AlertTriangle className="w-3 h-3" /> },
    "Rupture": { color: "bg-red-100 text-red-800", icon: <AlertCircle className="w-3 h-3" /> },
  };

  const { color, icon } = config[statut as keyof typeof config] || config["Normal"];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {statut}
    </span>
  );
}

function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
      type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <Check className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
} 