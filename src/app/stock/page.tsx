"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stock as stockData } from "@/data/stock";
import { Plus, Search, Filter, Package, AlertTriangle, TrendingUp, DollarSign, AlertCircle, Edit, Plus as PlusIcon, Minus as MinusIcon, RefreshCw } from "lucide-react";

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
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Stock</h1>
        <p className="text-gray-500 text-sm">Gérez vos stocks et alertes</p>
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Alertes de stock</h3>
          </div>
          <div className="text-sm text-orange-700">
            {alertes.length} article(s) nécessitent votre attention :
            {alertes.slice(0, 3).map(item => (
              <span key={item.id} className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs ml-2 mb-1">
                {item.nom} ({item.quantite} restant{item.quantite > 1 ? 's' : ''})
              </span>
            ))}
            {alertes.length > 3 && (
              <span className="text-orange-600 ml-2">+{alertes.length - 3} autre(s)</span>
            )}
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total articles"
          value={stats.total.toString()}
          subtitle="En stock"
          icon={<Package className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Stock normal"
          value={stats.normal.toString()}
          subtitle="Articles disponibles"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Valeur totale"
          value={`${stats.valeurTotale.toFixed(0)}€`}
          subtitle="Stock disponible"
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Quantité totale"
          value={stats.quantiteTotale.toString()}
          subtitle="Unités en stock"
          icon={<Package className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </h2>
          <Button variant="outline" size="sm" onClick={reinitialiserFiltres}>
            Réinitialiser
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Nom de l'article..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={filtreCategorie}
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuts.map((statut) => (
                <option key={statut} value={statut}>{statut}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions et pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setModalOuvert(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un article
          </Button>
          <span className="text-sm text-gray-600">
            {stockFiltre.length} article(s) trouvé(s)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Lignes par page:</span>
          <select
            value={elementsParPage}
            onChange={(e) => {
              setElementsParPage(parseInt(e.target.value));
              setPageCourante(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Liste du stock */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur totale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockPage.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : (
                stockPage.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.nom}</div>
                          <div className="text-xs text-gray-500">Seuil: {item.seuilAlerte}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retirerQuantite(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </Button>
                        <span className={`text-sm font-medium ${
                          item.statut === "Rupture" ? "text-red-600" : 
                          item.statut === "Faible" ? "text-orange-600" : "text-gray-900"
                        }`}>
                          {item.quantite}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => ajouterQuantite(item.id)}
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.prixUnitaire}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.valeurTotale}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StockStatusBadge statut={item.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setItemEnEdition(item);
                            setModalOuvert(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const nouvelleQuantite = prompt(`Nouvelle quantité pour ${item.nom}:`, item.quantite.toString());
                            if (nouvelleQuantite !== null) {
                              const quantite = parseInt(nouvelleQuantite);
                              if (!isNaN(quantite) && quantite >= 0) {
                                modifierQuantite(item.id, quantite);
                              }
                            }
                          }}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {indexDebut + 1} à {Math.min(indexFin, stockFiltre.length)} sur {stockFiltre.length} articles
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante(prev => Math.max(prev - 1, 1))}
              disabled={pageCourante === 1}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-600">
              Page {pageCourante} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante(prev => Math.min(prev + 1, totalPages))}
              disabled={pageCourante === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Modal d'ajout d'article (simplifié) */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {itemEnEdition ? "Modifier l'article" : "Ajouter un article"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setModalOuvert(false);
                  setItemEnEdition(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'article</label>
                <Input
                  placeholder="Nom de l'article"
                  defaultValue={itemEnEdition?.nom || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                  <Input
                    type="number"
                    placeholder="0"
                    defaultValue={itemEnEdition?.quantite || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (€)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    defaultValue={itemEnEdition?.prixUnitaire || ""}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seuil d'alerte</label>
                <Input
                  type="number"
                  placeholder="5"
                  defaultValue={itemEnEdition?.seuilAlerte || ""}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setModalOuvert(false);
                  setItemEnEdition(null);
                }}
              >
                Annuler
              </Button>
              <Button>
                {itemEnEdition ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composants utilitaires
function StatCard({ title, value, subtitle, icon, color }: { 
  title: string, 
  value: string, 
  subtitle: string, 
  icon: React.ReactNode,
  color: string 
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
      <span className="text-xs opacity-80">{subtitle}</span>
    </div>
  );
}

function StockStatusBadge({ statut }: { statut: string }) {
  const colorMap: any = {
    "Normal": "bg-green-100 text-green-800",
    "Faible": "bg-orange-100 text-orange-800",
    "Rupture": "bg-red-100 text-red-800",
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorMap[statut] || colorMap["Normal"]}`}>
      {statut}
    </span>
  );
} 