"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleFormModal, Article } from "@/components/ArticleFormModal";
import { inventaire as inventaireData } from "@/data/inventaire";
import { Plus, Search, Filter, Eye, Heart, Edit, Archive, Trash2, TrendingUp, Package, DollarSign, Tag, ChevronDown, X, Check, AlertCircle, Clock, Truck, Users, BarChart3, Sparkles } from "lucide-react";

export default function InventairePage() {
  const [articles, setArticles] = useState<Article[]>(inventaireData);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [articleEnEdition, setArticleEnEdition] = useState<Article | null>(null);
  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [elementsParPage, setElementsParPage] = useState(10);
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");

  // Filtrage des articles
  const articlesFiltres = useMemo(() => {
    return articles.filter((article) => {
      const matchRecherche = article.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                           (article.marque && article.marque.toLowerCase().includes(recherche.toLowerCase()));
      const matchCategorie = filtreCategorie === "Toutes" || article.categorie === filtreCategorie;
      const matchStatut = filtreStatut === "Tous" || article.statut === filtreStatut;
      
      return matchRecherche && matchCategorie && matchStatut;
    });
  }, [articles, recherche, filtreCategorie, filtreStatut]);

  // Pagination
  const indexDebut = (pageCourante - 1) * elementsParPage;
  const indexFin = indexDebut + elementsParPage;
  const articlesPage = articlesFiltres.slice(indexDebut, indexFin);
  const totalPages = Math.ceil(articlesFiltres.length / elementsParPage);

  // Statistiques
  const stats = useMemo(() => {
    const total = articles.length;
    const enVente = articles.filter(a => a.statut === "En vente").length;
    const vendus = articles.filter(a => a.statut === "Vendu").length;
    const archives = articles.filter(a => a.statut === "Archivé").length;
    const valeurTotale = articles
      .filter(a => a.statut === "En vente")
      .reduce((sum, a) => sum + a.prix, 0);
    const margeTotale = articles
      .filter(a => a.statut === "En vente")
      .reduce((sum, a) => sum + a.marge, 0);

    return { total, enVente, vendus, archives, valeurTotale, margeTotale };
  }, [articles]);

  // Gestion des articles
  const ajouterArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
    setModalOuvert(false);
    setMessageSucces("Article ajouté avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const modifierArticle = (article: Article) => {
    setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    setModalOuvert(false);
    setArticleEnEdition(null);
    setMessageSucces("Article modifié avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const supprimerArticle = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setArticles(prev => prev.filter(a => a.id !== id));
      setMessageSucces("Article supprimé avec succès !");
      setTimeout(() => setMessageSucces(""), 3000);
    }
  };

  const archiverArticle = (id: number) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, statut: "Archivé" as const } : a
    ));
    setMessageSucces("Article archivé avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const ouvrirModal = (article?: Article) => {
    if (article) {
      setArticleEnEdition(article);
    } else {
      setArticleEnEdition(null);
    }
    setModalOuvert(true);
  };

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreCategorie("Toutes");
    setFiltreStatut("Tous");
    setPageCourante(1);
  };

  const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
  const statuts = ["Tous", "En vente", "Vendu", "Archivé"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec titre et actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Inventaire
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Gérez votre catalogue d'articles</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => ouvrirModal()} 
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

      {/* Cartes de statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total articles"
          value={stats.total.toString()}
          subtitle="Dans l'inventaire"
          icon={<Package className="w-6 h-6" />}
          color="blue"
          trend="+5%"
        />
        <StatCard
          title="En vente"
          value={stats.enVente.toString()}
          subtitle="Articles actifs"
          icon={<Tag className="w-6 h-6" />}
          color="green"
          trend="+12%"
        />
        <StatCard
          title="Valeur totale"
          value={`${stats.valeurTotale.toFixed(0)}€`}
          subtitle="Articles en vente"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
          trend="+8%"
        />
        <StatCard
          title="Marge totale"
          value={`${stats.margeTotale.toFixed(0)}€`}
          subtitle="Bénéfice potentiel"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
          trend="+15%"
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
            placeholder="Rechercher par nom ou marque..."
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

      {/* Tableau des articles modernisé */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Liste des articles</h3>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Marge</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {articlesPage.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 text-lg">Aucun article trouvé</p>
                      <p className="text-slate-400 text-sm">Essayez d'ajuster vos filtres ou d'ajouter un nouvel article</p>
                    </div>
                  </td>
                </tr>
              ) : (
                articlesPage.map((article, index) => (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{article.nom}</div>
                          {article.marque && (
                            <div className="text-sm text-slate-500">{article.marque}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {article.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{article.prix}€</div>
                      <div className="text-sm text-slate-500">Coût: {article.cout}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{article.marge}€</div>
                      <div className="text-sm text-slate-500">{((article.marge / article.prix) * 100).toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge statut={article.statut} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => ouvrirModal(article)}
                          className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => archiverArticle(article.id)}
                          className="text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => supprimerArticle(article.id)}
                          className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
                Affichage de {indexDebut + 1} à {Math.min(indexFin, articlesFiltres.length)} sur {articlesFiltres.length} articles
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

      {/* Modal d'ajout/modification d'article */}
      <ArticleFormModal
        isOpen={modalOuvert}
        onClose={() => setModalOuvert(false)}
        onSubmit={articleEnEdition ? modifierArticle : ajouterArticle}
        article={articleEnEdition}
      />
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

function StatusBadge({ statut }: { statut: string }) {
  const config = {
    "En vente": { color: "bg-green-100 text-green-800", icon: <Tag className="w-3 h-3" /> },
    "Vendu": { color: "bg-blue-100 text-blue-800", icon: <Check className="w-3 h-3" /> },
    "Archivé": { color: "bg-slate-100 text-slate-800", icon: <Archive className="w-3 h-3" /> },
  };

  const { color, icon } = config[statut as keyof typeof config] || config["En vente"];

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