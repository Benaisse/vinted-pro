'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import { Article } from "@/components/ArticleFormModal";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

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

export interface DataContextType {
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
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'inventaire dynamiquement depuis Supabase
  useEffect(() => {
    if (!user || authLoading) return;
    setIsLoaded(false);
    setError(null);
    const fetchArticles = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('inventaire')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setError('Erreur lors du chargement de l\'inventaire.');
        setArticles([]);
      } else {
        setArticles(data || []);
      }
      setIsLoaded(true);
    };
    fetchArticles();
  }, [user, authLoading]);

  // Charger le stock dynamiquement depuis Supabase
  useEffect(() => {
    if (!user || authLoading) return;
    setIsLoaded(false);
    setError(null);
    const fetchStock = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setError('Erreur lors du chargement du stock.');
        setStock([]);
      } else {
        setStock(data || []);
      }
      setIsLoaded(true);
    };
    fetchStock();
  }, [user, authLoading]);

  // Charger les ventes dynamiquement depuis Supabase
  useEffect(() => {
    if (!user || authLoading) return;
    setIsLoaded(false);
    setError(null);
    const fetchVentes = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('ventes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setError('Erreur lors du chargement des ventes.');
        setVentes([]);
      } else {
        setVentes(data || []);
      }
      setIsLoaded(true);
    };
    fetchVentes();
  }, [user, authLoading]);

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

  // Actions pour les articles (INVENTAIRE)
  const addArticle = async (article: Article) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('inventaire')
        .insert([{ ...article, user_id: user.id }])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setArticles(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      setError('Erreur lors de l\'ajout de l\'article.');
    }
  };

  const updateArticle = async (article: Article) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('inventaire')
        .update({ ...article })
        .eq('id', article.id)
        .eq('user_id', user.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setArticles(prev => prev.map(a => a.id === article.id ? data[0] : a));
      }
    } catch (err: any) {
      setError('Erreur lors de la modification de l\'article.');
    }
  };

  const deleteArticle = async (id: number) => {
    setError(null);
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('inventaire')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      setError('Erreur lors de la suppression de l\'article.');
    }
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
  const addStockItem = async (item: Omit<StockItem, 'id'>) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('stock')
        .insert([{ ...item, user_id: user.id }])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setStock(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      setError('Erreur lors de l\'ajout au stock.');
    }
  };

  const updateStock = async (item: StockItem) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('stock')
        .update({ ...item })
        .eq('id', item.id)
        .eq('user_id', user.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setStock(prev => prev.map(s => s.id === item.id ? data[0] : s));
      }
    } catch (err: any) {
      setError('Erreur lors de la modification du stock.');
    }
  };

  const deleteStockItem = async (id: number) => {
    setError(null);
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setStock(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError('Erreur lors de la suppression du stock.');
    }
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

  // Réinitialiser le localStorage à la première connexion d'un nouvel utilisateur
  useEffect(() => {
    if (!user || authLoading) return;
    // Réinitialiser le localStorage pour un nouvel utilisateur
    localStorage.removeItem('vinted-pro-articles');
    localStorage.removeItem('vinted-pro-ventes');
    localStorage.removeItem('vinted-pro-stock');
  }, [user?.id]);

  if (!isLoaded && !authLoading) return <div>Chargement des ventes...</div>;
  if (error) return <div style={{ color: 'red', padding: 16 }}>{error}</div>;

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
