"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleFormModal, Article } from "@/components/ArticleFormModal";
import { inventaire as inventaireData } from "@/data/inventaire";
import { Plus, Search, Filter, Eye, Heart, Edit, Archive, Trash2, TrendingUp, Package, DollarSign, Tag } from "lucide-react";

export default function InventairePage() {
  const [articles, setArticles] = useState<Article[]>(inventaireData);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [articleEnEdition, setArticleEnEdition] = useState<Article | null>(null);
  const [recherche, setRecherche] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [pageCourante, setPageCourante] = useState(1);
  const [elementsParPage, setElementsParPage] = useState(10);

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
  };

  const modifierArticle = (article: Article) => {
    setArticles(prev => prev.map(a => a.id === article.id ? article : a));
    setModalOuvert(false);
    setArticleEnEdition(null);
  };

  const supprimerArticle = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const archiverArticle = (id: number) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, statut: "Archivé" as const } : a
    ));
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
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Inventaire</h1>
        <p className="text-gray-500 text-sm">Gérez votre catalogue d'articles</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total articles"
          value={stats.total.toString()}
          subtitle="Dans l'inventaire"
          icon={<Package className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="En vente"
          value={stats.enVente.toString()}
          subtitle="Articles actifs"
          icon={<Tag className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Valeur totale"
          value={`${stats.valeurTotale.toFixed(0)}€`}
          subtitle="Articles en vente"
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Marge totale"
          value={`${stats.margeTotale.toFixed(0)}€`}
          subtitle="Bénéfice potentiel"
          icon={<TrendingUp className="w-5 h-5" />}
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
                placeholder="Nom ou marque..."
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
          <Button onClick={() => ouvrirModal()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter un article
          </Button>
          <span className="text-sm text-gray-600">
            {articlesFiltres.length} article(s) trouvé(s)
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

      {/* Liste des articles */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articlesPage.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : (
                articlesPage.map((article) => (
                  <tr key={article.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          {article.image ? (
                            <img src={article.image} alt={article.nom} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{article.nom}</div>
                          <div className="text-sm text-gray-500">{article.marque}</div>
                          {article.taille && (
                            <div className="text-xs text-gray-400">Taille: {article.taille}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.prix}€</div>
                      <div className="text-xs text-gray-500">Coût: {article.cout}€</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.marge}€</div>
                      <div className="text-xs text-gray-500">{article.margePourcent}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge statut={article.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.vues}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {article.likes}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => ouvrirModal(article)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {article.statut !== "Archivé" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => archiverArticle(article.id)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => supprimerArticle(article.id)}
                          className="text-red-600 hover:text-red-800"
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {indexDebut + 1} à {Math.min(indexFin, articlesFiltres.length)} sur {articlesFiltres.length} articles
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

      {/* Modal */}
      <ArticleFormModal
        open={modalOuvert}
        onClose={() => {
          setModalOuvert(false);
          setArticleEnEdition(null);
        }}
        onSubmit={articleEnEdition ? modifierArticle : ajouterArticle}
        article={articleEnEdition}
      />
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

function StatusBadge({ statut }: { statut: string }) {
  const colorMap: any = {
    "En vente": "bg-green-100 text-green-800",
    "Vendu": "bg-blue-100 text-blue-800",
    "Archivé": "bg-gray-100 text-gray-800",
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorMap[statut] || colorMap["Archivé"]}`}>
      {statut}
    </span>
  );
} 