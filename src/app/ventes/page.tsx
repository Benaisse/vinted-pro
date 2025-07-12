"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Calendar, Plus, Download, Filter, X, Check, AlertCircle, Clock, Truck } from "lucide-react";

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
  statut: string;
}

// Données mockées pour l'exemple
const ventesDataInitial: Vente[] = [
  {
    id: 1,
    article: "Robe Zara fleurie",
    categorie: "Vêtements",
    acheteur: "Marie L.",
    prix: 25,
    cout: 5,
    marge: 20,
    margePourcent: 80,
    date: "15/01/2024",
    statut: "Livré",
  },
  {
    id: 2,
    article: "Sneakers Nike Air Max",
    categorie: "Chaussures",
    acheteur: "Thomas M.",
    prix: 65,
    cout: 15,
    marge: 50,
    margePourcent: 77,
    date: "14/01/2024",
    statut: "Expédié",
  },
  {
    id: 3,
    article: "Sac Longchamp",
    categorie: "Sacs",
    acheteur: "Sophie R.",
    prix: 45,
    cout: 8,
    marge: 37,
    margePourcent: 82,
    date: "13/01/2024",
    statut: "Livré",
  },
  {
    id: 4,
    article: "Jean Levi's 501",
    categorie: "Vêtements",
    acheteur: "Pierre D.",
    prix: 35,
    cout: 12,
    marge: 23,
    margePourcent: 66,
    date: "12/01/2024",
    statut: "En préparation",
  },
  {
    id: 5,
    article: "Montre Daniel Wellington",
    categorie: "Accessoires",
    acheteur: "Emma F.",
    prix: 80,
    cout: 20,
    marge: 60,
    margePourcent: 75,
    date: "11/01/2024",
    statut: "Livré",
  },
  {
    id: 6,
    article: "Blazer H&M",
    categorie: "Vêtements",
    acheteur: "Lucas B.",
    prix: 30,
    cout: 7,
    marge: 23,
    margePourcent: 77,
    date: "10/01/2024",
    statut: "Expédié",
  },
  {
    id: 7,
    article: "Basket Converse",
    categorie: "Chaussures",
    acheteur: "Julie M.",
    prix: 40,
    cout: 10,
    marge: 30,
    margePourcent: 75,
    date: "09/01/2024",
    statut: "Livré",
  },
  {
    id: 8,
    article: "Écharpe Zara",
    categorie: "Accessoires",
    acheteur: "Antoine L.",
    prix: 15,
    cout: 3,
    marge: 12,
    margePourcent: 80,
    date: "08/01/2024",
    statut: "Livré",
  },
];

const categories = ["Toutes", "Vêtements", "Chaussures", "Sacs", "Accessoires"];
const statuts = ["Tous", "En préparation", "Expédié", "Livré", "Annulé"];

export default function VentesPage() {
  const [ventes, setVentes] = useState<Vente[]>(ventesDataInitial);
  const [filtreCategorie, setFiltreCategorie] = useState("Toutes");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [pageCourante, setPageCourante] = useState(1);
  const [elementsParPage, setElementsParPage] = useState(5);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [nouvelleVente, setNouvelleVente] = useState({
    article: "",
    categorie: "Vêtements",
    acheteur: "",
    prix: "",
    cout: "",
    date: new Date().toISOString().split('T')[0],
    statut: "En préparation",
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
    
    const nouvelleVenteComplete: Vente = {
      id: Math.max(...ventes.map(v => v.id)) + 1,
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
    
    setVentes([nouvelleVenteComplete, ...ventes]);
    setModalOuvert(false);
    setNouvelleVente({
      article: "",
      categorie: "Vêtements",
      acheteur: "",
      prix: "",
      cout: "",
      date: new Date().toISOString().split('T')[0],
      statut: "En préparation",
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

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ventes</h1>
        <p className="text-gray-500 text-sm">Gérez vos ventes et suivez vos performances</p>
      </div>

      {/* Message de succès */}
      {messageSucces && <Toast message={messageSucces} type="success" />}

      {/* Filtres avancés */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Filtres</h2>
          <Button variant="outline" size="sm" onClick={reinitialiserFiltres}>
            Réinitialiser
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              {statuts.map((stat) => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <Input
              placeholder="Article ou acheteur..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>

          {/* Gamme de prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix min (€)</label>
            <Input
              type="number"
              placeholder="0"
              value={prixMin}
              onChange={(e) => setPrixMin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix max (€)</label>
            <Input
              type="number"
              placeholder="1000"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventes totales"
          value={stats.ventesTotales.toString()}
          subtitle="Cette période"
          color="blue"
        />
        <StatCard
          title="Chiffre d'affaires"
          value={`${stats.chiffreAffaires.toFixed(0)}€`}
          subtitle="Total des ventes"
          color="green"
        />
        <StatCard
          title="Marge totale"
          value={`${stats.margeTotale.toFixed(0)}€`}
          subtitle="Bénéfice net"
          color="purple"
        />
        <StatCard
          title="Panier moyen"
          value={`${stats.panierMoyen.toFixed(0)}€`}
          subtitle="Par vente"
          color="orange"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setModalOuvert(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle vente
          </Button>
          <Button variant="outline" onClick={exporterCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
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

      {/* Tableau des ventes */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acheteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventesPage.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">Aucune vente trouvée.</td>
                </tr>
              ) : (
                ventesPage.map((vente) => (
                  <tr
                    key={vente.id}
                    className="hover:bg-blue-50 transition-colors duration-150 focus-within:bg-blue-100"
                    tabIndex={0}
                    aria-label={`Vente ${vente.article} à ${vente.acheteur}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vente.article}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vente.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vente.acheteur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.prix}€</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vente.cout}€</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vente.marge}€</div>
                      <div className="text-xs text-gray-500">{vente.margePourcent.toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vente.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge statut={vente.statut} />
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
            Affichage de {indexDebut + 1} à {Math.min(indexFin, ventesFiltrees.length)} sur {ventesFiltrees.length} résultats
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante(pageCourante - 1)}
              disabled={pageCourante === 1}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-700">
              Page {pageCourante} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageCourante(pageCourante + 1)}
              disabled={pageCourante === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Vente */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Nouvelle vente</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOuvert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Article */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Article *</label>
                <Input
                  value={nouvelleVente.article}
                  onChange={(e) => setNouvelleVente({...nouvelleVente, article: e.target.value})}
                  placeholder="Nom de l'article"
                  className={erreurs.article ? "border-red-500" : ""}
                />
                {erreurs.article && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {erreurs.article}
                  </div>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={nouvelleVente.categorie}
                  onChange={(e) => setNouvelleVente({...nouvelleVente, categorie: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Acheteur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acheteur *</label>
                <Input
                  value={nouvelleVente.acheteur}
                  onChange={(e) => setNouvelleVente({...nouvelleVente, acheteur: e.target.value})}
                  placeholder="Nom de l'acheteur"
                  className={erreurs.acheteur ? "border-red-500" : ""}
                />
                {erreurs.acheteur && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {erreurs.acheteur}
                  </div>
                )}
              </div>

              {/* Prix et Coût */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                  <Input
                    type="number"
                    value={nouvelleVente.prix}
                    onChange={(e) => setNouvelleVente({...nouvelleVente, prix: e.target.value})}
                    placeholder="0.00"
                    className={erreurs.prix ? "border-red-500" : ""}
                  />
                  {erreurs.prix && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {erreurs.prix}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coût (€)</label>
                  <Input
                    type="number"
                    value={nouvelleVente.cout}
                    onChange={(e) => setNouvelleVente({...nouvelleVente, cout: e.target.value})}
                    placeholder="0.00"
                    className={erreurs.cout ? "border-red-500" : ""}
                  />
                  {erreurs.cout && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {erreurs.cout}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Input
                  type="date"
                  value={nouvelleVente.date}
                  onChange={(e) => setNouvelleVente({...nouvelleVente, date: e.target.value})}
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={nouvelleVente.statut}
                  onChange={(e) => setNouvelleVente({...nouvelleVente, statut: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuts.slice(1).map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setModalOuvert(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={ajouterVente}
                className="flex-1"
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

function StatCard({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) {
  const colorMap: any = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-600 text-white",
    orange: "bg-orange-500 text-white",
  };
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-2 ${colorMap[color]} shadow-sm`}>
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs opacity-80">{subtitle}</span>
    </div>
  );
}

function StatusBadge({ statut }: { statut: string }) {
  const colorMap: any = {
    "En préparation": "bg-yellow-100 text-yellow-800 border border-yellow-300",
    "Expédié": "bg-blue-100 text-blue-800 border border-blue-300",
    "Livré": "bg-green-100 text-green-800 border border-green-300",
    "Annulé": "bg-red-100 text-red-800 border border-red-300",
  };
  const iconMap: any = {
    "En préparation": <Clock className="w-3.5 h-3.5 mr-1" />,
    "Expédié": <Truck className="w-3.5 h-3.5 mr-1" />,
    "Livré": <Check className="w-3.5 h-3.5 mr-1" />,
    "Annulé": <X className="w-3.5 h-3.5 mr-1" />,
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full gap-1 ${colorMap[statut] || "bg-gray-100 text-gray-800 border border-gray-300"}`}
      tabIndex={0}
      aria-label={`Statut : ${statut}`}
    >
      {iconMap[statut]}
      {statut}
    </span>
  );
} 

// Ajout d'un composant Toast simple
function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all animate-fade-in ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}

// Ajout d'une animation fade-in
<style jsx global>{`
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(.4,0,.2,1);
}
`}</style> 