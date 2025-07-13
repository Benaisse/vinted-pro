"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleFormModal, Article } from "@/components/ArticleFormModal";
import { useData } from "@/contexts/DataContext";
import { useStats } from "@/contexts/StatsContext";
import { Plus, Search, Filter, Eye, Heart, Edit, Archive, Trash2, TrendingUp, Package, DollarSign, Tag, ChevronDown, X, Check, AlertCircle, Clock, Truck, Users, BarChart3, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InventairePage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useData();
  const stats = useStats();
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
  const statsLocal = useMemo(() => {
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
    addArticle(article);
    setModalOuvert(false);
    setMessageSucces("Article ajouté avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const modifierArticle = (article: Article) => {
    updateArticle(article);
    setModalOuvert(false);
    setArticleEnEdition(null);
    setMessageSucces("Article modifié avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const supprimerArticle = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteArticle(id);
      setMessageSucces("Article supprimé avec succès !");
      setTimeout(() => setMessageSucces(""), 3000);
    }
  };

  const archiverArticle = (id: number) => {
    // Ici, il faudrait une méthode d'archivage dans le contexte si besoin
    setMessageSucces("Article archivé avec succès ! (fonction à implémenter dans le contexte)");
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
    <AnimatePresence mode="wait">
      <motion.div
        key="inventaire-page"
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
                Inventaire
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Gérez votre catalogue d'articles</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => ouvrirModal()} 
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

        {/* Cartes de statistiques modernisées */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total articles"
            value={stats?.totalArticles != null ? stats.totalArticles.toString() : '0'}
            subtitle="Dans l'inventaire"
            icon={<Package className="w-6 h-6" />}
            color="blue"
            trend=""
          />
          <StatCard
            title="En vente"
            value={statsLocal.enVente.toString()}
            subtitle="Articles actifs"
            icon={<Tag className="w-6 h-6" />}
            color="green"
            trend=""
          />
          <StatCard
            title="Valeur totale"
            value={statsLocal.valeurTotale.toLocaleString() + '€'}
            subtitle="Articles en vente"
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
            trend=""
          />
          <StatCard
            title="Marge totale"
            value={statsLocal.margeTotale.toLocaleString() + '€'}
            subtitle="Bénéfice potentiel"
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
            trend=""
          />
        </motion.div>

        {/* Section filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-indigo-600 transition-colors duration-200" />
              <Input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un article, marque..."
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

        {/* Grille d'articles */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {articlesPage.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              
              <div className="relative z-10">
                {/* Header de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Package className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={(e) => { e.stopPropagation(); ouvrirModal(article); }}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); archiverArticle(article.id); }}
                      className="p-1 text-slate-400 hover:text-yellow-600 hover:scale-110 transition-all duration-200"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); supprimerArticle(article.id); }}
                      className="p-1 text-slate-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200 line-clamp-2">
                      {article.nom}
                    </h3>
                    {article.marque && (
                      <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
                        {article.marque}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 group-hover:bg-slate-200 transition-colors duration-200">
                      {article.categorie}
                    </span>
                    <StatusBadge statut={article.statut} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Prix</span>
                      <span className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-200">{article.prix}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">Marge</span>
                      <span className="font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-200">+{article.marge}€</span>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
                      <Eye className="w-3 h-3" />
                      <span>{article.vues}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
                      <Heart className="w-3 h-3" />
                      <span>{article.likes}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                      {article.margePourcent}% marge
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="px-6 py-4 border-t border-slate-200 bg-slate-50/50"
            >
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
            </motion.div>
          )}

        {/* Modal d'ajout/modification d'article */}
        <AnimatePresence>
          {modalOuvert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                <ArticleFormModal
                  open={modalOuvert}
                  onClose={() => setModalOuvert(false)}
                  onSubmit={articleEnEdition ? modifierArticle : ajouterArticle}
                  article={articleEnEdition}
                />
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

function StatusBadge({ statut }: { statut: string }) {
  const getStatusConfig = (statut: string) => {
    switch (statut) {
      case "En vente":
        return {
          bg: "bg-green-100 text-green-800 group-hover:bg-green-200",
          icon: <Tag className="w-3 h-3" />
        };
      case "Vendu":
        return {
          bg: "bg-blue-100 text-blue-800 group-hover:bg-blue-200",
          icon: <Check className="w-3 h-3" />
        };
      case "Archivé":
        return {
          bg: "bg-slate-100 text-slate-800 group-hover:bg-slate-200",
          icon: <Archive className="w-3 h-3" />
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

function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
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
    </motion.div>
  );
} 