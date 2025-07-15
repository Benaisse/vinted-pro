'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import { Article } from "@/components/ArticleFormModal";
import { inventaire as inventaireData } from "@/data/inventaire";
import { ventes as ventesData } from "@/data/ventes";
import { stock as stockData } from "@/data/stock";

// Types pour les données
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

interface DataContextType {
  // Inventaire
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  
  // Ventes
  ventes: Vente[];
  addVente: (vente: Omit<Vente, 'id'>) => void;
  updateVente: (vente: Vente) => void;
  deleteVente: (id: number) => void;
  
  // Stock
  stock: StockItem[];
  updateStock: (item: StockItem) => void;
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  deleteStockItem: (id: number) => void;
  
  // Statistiques globales
  stats: {
    totalArticles: number;
    totalVentes: number;
    totalRevenus: number;
    totalMarge: number;
    articlesEnVente: number;
    articlesVendus: number;
    stockFaible: number;
    stockRupture: number;
  };
  
  // Actions synchronisées
  vendreArticle: (articleId: number, acheteur: string, prix: number) => void;
  ajouterAuStock: (article: Article, quantite: number) => void;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialisation par défaut avec les données mock
  const [articles, setArticles] = useState<Article[]>(inventaireData);
  const [ventes, setVentes] = useState<Vente[]>(ventesData.map(toVente));
  const [stock, setStock] = useState<StockItem[]>(stockData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calcul des statistiques en temps réel
  const stats = {
    totalArticles: articles.length,
    totalVentes: ventes.length,
    totalRevenus: ventes.reduce((sum, v) => sum + v.prix, 0),
    totalMarge: ventes.reduce((sum, v) => sum + v.marge, 0),
    articlesEnVente: articles.filter(a => a.statut === "En vente").length,
    articlesVendus: articles.filter(a => a.statut === "Vendu").length,
    stockFaible: stock.filter(s => s.statut === "Faible").length,
    stockRupture: stock.filter(s => s.statut === "Rupture").length,
  };

  // Actions pour les articles
  const addArticle = (article: Article) => {
    const newArticle = {
      ...article,
      id: Date.now(),
      dateAjout: new Date().toLocaleDateString('fr-FR'),
      vues: 0,
      likes: 0,
      marge: article.prix - article.cout,
      margePourcent: Math.round(((article.prix - article.cout) / article.prix) * 100)
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (article: Article) => {
    setArticles(prev => prev.map(a => 
      a.id === article.id 
        ? { 
            ...a, 
            ...article,
            marge: article.prix - article.cout,
            margePourcent: Math.round(((article.prix - article.cout) / article.prix) * 100)
          } 
        : a
    ));
  };

  const deleteArticle = (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // Actions pour les ventes
  const addVente = (vente: Omit<Vente, 'id'>) => {
    const newVente = {
      ...vente,
      id: Date.now(),
      marge: vente.prix - vente.cout,
      margePourcent: Math.round(((vente.prix - vente.cout) / vente.prix) * 100)
    };
    setVentes(prev => [newVente, ...prev]);
  };

  const updateVente = (vente: Vente) => {
    setVentes(prev => prev.map(v => 
      v.id === vente.id 
        ? { 
            ...v, 
            ...vente,
            marge: vente.prix - vente.cout,
            margePourcent: Math.round(((vente.prix - vente.cout) / vente.prix) * 100)
          } 
        : v
    ));
  };

  const deleteVente = (id: number) => {
    setVentes(prev => prev.filter(v => v.id !== id));
  };

  // Actions pour le stock
  const updateStock = (item: StockItem) => {
    setStock(prev => prev.map(s => 
      s.id === item.id 
        ? { 
            ...s, 
            ...item,
            valeurTotale: item.quantite * item.prixUnitaire,
            statut: item.quantite === 0 ? "Rupture" : item.quantite <= item.seuilAlerte ? "Faible" : "Normal"
          } 
        : s
    ));
  };

  const addStockItem = (item: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = {
      ...item,
      id: Date.now(),
      valeurTotale: item.quantite * item.prixUnitaire,
      statut: item.quantite === 0 ? "Rupture" : item.quantite <= item.seuilAlerte ? "Faible" : "Normal",
      derniereMiseAJour: new Date().toLocaleDateString('fr-FR')
    };
    setStock(prev => [newItem, ...prev]);
  };

  const deleteStockItem = (id: number) => {
    setStock(prev => prev.filter(s => s.id !== id));
  };

  // Actions synchronisées
  const vendreArticle = (articleId: number, acheteur: string, prix: number) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    // Ajouter la vente
    addVente({
      article: article.nom,
      categorie: article.categorie,
      acheteur,
      prix,
      cout: article.cout,
      marge: 0, // Sera calculé automatiquement
      margePourcent: 0, // Sera calculé automatiquement
      date: new Date().toLocaleDateString('fr-FR'),
      statut: "En cours"
    });

    // Mettre à jour le statut de l'article
    updateArticle({
      ...article,
      statut: "Vendu"
    });

    // Mettre à jour le stock
    const stockItem = stock.find(s => s.nom === article.nom);
    if (stockItem) {
      updateStock({
        ...stockItem,
        quantite: Math.max(0, stockItem.quantite - 1)
      });
    }
  };

  const ajouterAuStock = (article: Article, quantite: number) => {
    const existingStock = stock.find(s => s.nom === article.nom);
    
    if (existingStock) {
      updateStock({
        ...existingStock,
        quantite: existingStock.quantite + quantite
      });
    } else {
      addStockItem({
        nom: article.nom,
        categorie: article.categorie,
        quantite,
        seuilAlerte: 3,
        prixUnitaire: article.prix,
        valeurTotale: 0, // Sera calculé automatiquement
        statut: "Normal", // Sera calculé automatiquement
        derniereMiseAJour: new Date().toLocaleDateString('fr-FR')
      });
    }
  };

  function toVente(obj: any): Vente {
    return {
      id: Number(obj.id),
      article: String(obj.article),
      categorie: String(obj.categorie),
      acheteur: String(obj.acheteur),
      prix: Number(obj.prix),
      cout: Number(obj.cout),
      marge: Number(obj.marge),
      margePourcent: Number(obj.margePourcent),
      date: String(obj.date),
      statut: (["Livré", "Expédié", "En cours"].includes(obj.statut) ? obj.statut : "En cours") as "Livré" | "Expédié" | "En cours"
    };
  }

  // Charger les données du localStorage côté client uniquement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedArticles = localStorage.getItem('vinted-pro-articles');
      if (savedArticles) setArticles(JSON.parse(savedArticles));
      const savedVentes = localStorage.getItem('vinted-pro-ventes');
      if (savedVentes) setVentes(JSON.parse(savedVentes).map(toVente));
      const savedStock = localStorage.getItem('vinted-pro-stock');
      if (savedStock) {
        const parsedStock = JSON.parse(savedStock);
        setStock(parsedStock.map((s: any) => ({
          ...s,
          statut: ["Normal", "Faible", "Rupture"].includes(s.statut) ? s.statut : "Normal"
        })));
      }
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return null;

  return (
    <DataContext.Provider value={{
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      ventes,
      addVente,
      updateVente,
      deleteVente,
      stock,
      updateStock,
      addStockItem,
      deleteStockItem,
      stats,
      vendreArticle,
      ajouterAuStock
    }}>
      {children}
    </DataContext.Provider>
  );
}; 
