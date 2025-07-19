"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stock as stockData } from "@/data/stock";
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, DollarSign, AlertCircle, Edit, Plus as PlusIcon, Minus as MinusIcon, RefreshCw, ChevronDown, X, Check, Clock, Truck, Users, BarChart3, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/contexts/DataContext";
import { Toast } from "@/components/ui/Toast";

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
  const { stock, updateStock, addStockItem, deleteStockItem } = useData();
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

  // Gestion du stock (modification de quantité)
  const modifierQuantite = (id: number, nouvelleQuantite: number) => {
    const item = stock.find(item => item.id === id);
    if (!item) return;
    const quantite = Math.max(0, nouvelleQuantite);
    let statut: "Normal" | "Faible" | "Rupture" = "Normal";
    if (quantite === 0) statut = "Rupture";
    else if (quantite <= item.seuilAlerte) statut = "Faible";
    updateStock({
      ...item,
      quantite,
      valeurTotale: quantite * item.prixUnitaire,
      statut,
      derniereMiseAJour: new Date().toLocaleDateString('fr-FR')
    });
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
    <AnimatePresence mode="wait">
      <motion.div
        key="stock-page"
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
                Stock
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Gérez vos stocks et alertes</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setModalOuvert(true)} 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Ajouter un article
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Message de succès */}
        <AnimatePresence>
          {messageSucces && <Toast message={messageSucces} type="success" />}
        </AnimatePresence>

        {/* Alertes */}
        <AnimatePresence>
          {alertes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-2xl p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <AlertTriangle className="w-5 h-5 text-orange-600 group-hover:rotate-12 transition-transform duration-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 text-lg group-hover:text-orange-900 transition-colors duration-200">Alertes de stock</h3>
                  <p className="text-orange-600 text-sm group-hover:text-orange-700 transition-colors duration-200">{alertes.length} article(s) nécessitent votre attention</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {alertes.slice(0, 5).map(item => (
                  <span key={item.id} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Package className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
                    {item.nom} ({item.quantite} restant{item.quantite > 1 ? 's' : ''})
                  </span>
                ))}
                {alertes.length > 5 && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 hover:scale-105 transition-all duration-200 cursor-pointer">
                    +{alertes.length - 5} autre(s)
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cartes de statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total articles"
            value={stats.total.toString()}
            subtitle="En stock"
            icon={<Package className="w-6 h-6" />}
            color="blue"
            trend=""
          />
          <StatCard
            title="Stock normal"
            value={stats.normal.toString()}
            subtitle="Articles"
            icon={<Check className="w-6 h-6" />}
            color="green"
            trend=""
          />
          <StatCard
            title="Stock faible"
            value={stats.faible.toString()}
            subtitle="Alertes"
            icon={<AlertTriangle className="w-6 h-6" />}
            color="orange"
            trend=""
          />
          <StatCard
            title="Valeur totale"
            value={stats.valeurTotale.toLocaleString() + '€'}
            subtitle="Stock"
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
            trend=""
          />
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-indigo-600 transition-colors duration-200" />
              <Input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un article..."
                className="pl-10 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300"
              />
              {recherche && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500 focus:outline-none hover:scale-110 transition-all duration-200"
                  onClick={() => setRecherche("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              <select
                value={filtreCategorie}
                onChange={(e) => setFiltreCategorie(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300 hover:scale-105"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300 hover:scale-105"
              >
                {statuts.map((stat) => (
                  <option key={stat} value={stat}>{stat}</option>
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
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                onClick={reinitialiserFiltres}
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              </Button>
            </div>
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
        </motion.div>

        {/* Tableau du stock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Article
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Catégorie
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Quantité
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Prix unitaire
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Valeur totale
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      Statut
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockPage.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-slate-700 transition-colors duration-200">{item.nom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 group-hover:bg-slate-200 transition-colors duration-200">
                        {item.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 group-hover:text-slate-700 transition-colors duration-200">{item.quantite}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => retirerQuantite(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => ajouterQuantite(item.id)}
                            className="p-1 text-slate-400 hover:text-green-600 hover:scale-110 transition-all duration-200"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-slate-700 transition-colors duration-200">{item.prixUnitaire}€</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-slate-700 transition-colors duration-200">{item.valeurTotale}€</td>
                    <td className="px-6 py-4">
                      <StockStatusBadge statut={item.statut} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-1 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-green-600 hover:scale-110 transition-all duration-200">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            className="px-6 py-4 border-t border-slate-200 bg-slate-50/50"
          >
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
          </motion.div>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modalOuvert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setModalOuvert(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ...existing modal content... */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
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
  const isPositive = trend.startsWith('+');
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
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <TrendingUp className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="font-semibold group-hover:scale-110 transition-transform duration-200">{trend}</span>
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

function StockStatusBadge({ statut }: { statut: string }) {
  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case "Normal":
        return {
          bg: "bg-green-100 text-green-800 group-hover:bg-green-200",
          icon: <Check className="w-3 h-3" />
        };
      case "Faible":
        return {
          bg: "bg-orange-100 text-orange-800 group-hover:bg-orange-200",
          icon: <AlertTriangle className="w-3 h-3" />
        };
      case "Rupture":
        return {
          bg: "bg-red-100 text-red-800 group-hover:bg-red-200",
          icon: <AlertCircle className="w-3 h-3" />
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-800 group-hover:bg-slate-200",
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  const config = getStatusConfig(statut);

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 group-hover:scale-105 ${config.bg}`}>
      {config.icon}
      {statut}
    </span>
  );
} 