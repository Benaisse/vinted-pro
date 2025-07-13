import { ventes } from "@/data/ventes";
import { inventaire } from "@/data/inventaire";
import { stock } from "@/data/stock";

// Calculs pour les ventes
export const calculsVentes = {
  totalVentes: ventes.length,
  chiffreAffaires: ventes.reduce((sum, vente) => sum + vente.prix, 0),
  margeTotale: ventes.reduce((sum, vente) => sum + vente.marge, 0),
  margeMoyenne: Math.round(ventes.reduce((sum, vente) => sum + vente.margePourcent, 0) / ventes.length),
  ventesLivrees: ventes.filter(v => v.statut === "Livré").length,
  ventesExpediees: ventes.filter(v => v.statut === "Expédié").length,
  ventesEnCours: ventes.filter(v => v.statut === "En cours").length,
};

// Calculs pour l'inventaire
export const calculsInventaire = {
  totalArticles: inventaire.length,
  articlesEnVente: inventaire.filter(a => a.statut === "En vente").length,
  articlesVendus: inventaire.filter(a => a.statut === "Vendu").length,
  articlesArchives: inventaire.filter(a => a.statut === "Archivé").length,
  valeurTotale: inventaire.filter(a => a.statut === "En vente").reduce((sum, article) => sum + article.prix, 0),
  totalVues: inventaire.reduce((sum, article) => sum + article.vues, 0),
  totalLikes: inventaire.reduce((sum, article) => sum + article.likes, 0),
  revenuNet: inventaire.filter(a => a.statut === "Vendu").reduce((sum, article) => sum + article.marge, 0),
};

// Calculs pour le stock
export const calculsStock = {
  totalArticles: stock.length,
  valeurTotale: stock.reduce((sum, article) => sum + article.valeurTotale, 0),
  articlesEnRupture: stock.filter(s => s.statut === "Rupture").length,
  articlesFaibles: stock.filter(s => s.statut === "Faible").length,
  articlesNormaux: stock.filter(s => s.statut === "Normal").length,
  quantiteTotale: stock.reduce((sum, article) => sum + article.quantite, 0),
};

// Calculs généraux pour le Dashboard
export const calculsDashboard = {
  // Utilise les calculs des ventes
  totalVentes: calculsVentes.totalVentes,
  chiffreAffaires: calculsVentes.chiffreAffaires,
  margeTotale: calculsVentes.margeTotale,
  margeMoyenne: calculsVentes.margeMoyenne,
  
  // Utilise les calculs de l'inventaire
  totalArticles: calculsInventaire.totalArticles,
  articlesEnVente: calculsInventaire.articlesEnVente,
  revenuNet: calculsInventaire.revenuNet,
  
  // Utilise les calculs du stock
  valeurStock: calculsStock.valeurTotale,
  articlesEnRupture: calculsStock.articlesEnRupture,
}; 