'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import { Article } from "@/components/ArticleFormModal";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import { Boost, BoostFormData } from '@/types/boosts';

// Types pour les données
interface Vente {
  id: number;
  article: string;
  categorie: string;
  acheteur: string;
  prix: number;
  cout: number;
  marge: number;
  marge_pourcent: number;
  date: string; // Pour l'interface, on garde 'date' mais on mappe vers 'date_vente' dans Supabase
  date_vente?: string; // Ajouté pour la compatibilité avec Supabase
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
  deleteAllArticles: () => void;
  forceRefreshData: () => void;
  
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
  
  // Boosts
  boosts: Boost[];
  addBoost: (boost: BoostFormData) => void;
  updateBoost: (boost: Boost) => void;
  deleteBoost: (id: number) => void;
  
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
    totalBoosts: number;
    totalDepenseBoosts: number;
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
  const [boosts, setBoosts] = useState<Boost[]>([]);
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

  // Charger les boosts dynamiquement depuis Supabase
  useEffect(() => {
    if (!user || authLoading) return;
    const fetchBoosts = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('boosts')
        .select('*')
        .eq('user_id', user.id)
        .order('date_commande', { ascending: false });
      if (error) {
        console.error('Erreur lors du chargement des boosts:', error);
        setBoosts([]);
      } else {
        setBoosts(data || []);
      }
    };
    fetchBoosts();
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
    totalBoosts: boosts.length,
    totalDepenseBoosts: boosts.reduce((sum, b) => sum + b.montant_regle, 0),
  };

  // Actions pour les articles (INVENTAIRE)
  const addArticle = async (article: Article) => {
    setError(null);
    try {
      if (!supabase) {
        console.error('Supabase client non disponible');
        return;
      }
      if (!user) {
        console.error('Utilisateur non connecté');
        return;
      }
      
      // Créer un objet avec seulement les champs qui existent dans Supabase
      // Ne pas inclure l'ID car Supabase le génère automatiquement
      const articleForSupabase = {
        nom: article.nom,
        categorie: article.categorie,
        description: article.description || '',
        etat: article.etat,
        marque: article.marque || '',
        taille: article.taille || '',
        prix: article.prix,
        cout: article.cout,
        statut: article.statut,
        vues: article.vues || 0,
        likes: article.likes || 0,
        date_ajout: article.dateAjout || new Date().toISOString().split('T')[0],
        image: article.image || '',
        user_id: user.id
      };
      
      console.log('Tentative d\'ajout d\'article:', articleForSupabase);
      
      const { data, error } = await supabase
        .from('inventaire')
        .insert([articleForSupabase])
        .select();
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      console.log('Article ajouté avec succès:', data);
      
      if (data && data.length > 0) {
        setArticles(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      console.error('Erreur complète:', err);
      setError('Erreur lors de l\'ajout de l\'article.');
    }
  };

  const updateArticle = async (article: Article, oldNom?: string) => {
    setError(null);
    try {
      if (!supabase) return;
      // Mettre à jour l'article dans l'inventaire
      const articleForSupabase = {
        nom: article.nom,
        categorie: article.categorie,
        etat: article.etat,
        prix: article.prix,
        cout: article.cout,
        statut: article.statut
      };
      const { data, error } = await supabase
        .from('inventaire')
        .update(articleForSupabase)
        .eq('id', article.id)
        .eq('user_id', user.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setArticles(prev => prev.map(a => a.id === article.id ? data[0] : a));
      }
      // Synchroniser les ventes
      const nomRecherche = oldNom || article.nom;
      const { data: ventesToUpdate, error: ventesError } = await supabase
        .from('ventes')
        .select('*')
        .eq('user_id', user.id)
        .eq('article', nomRecherche);
      if (ventesError) throw ventesError;
      if (ventesToUpdate && ventesToUpdate.length > 0) {
        for (const vente of ventesToUpdate) {
          const marge = vente.prix - article.cout;
          const marge_pourcent = vente.prix > 0 ? (marge / vente.prix) * 100 : 0;
          await supabase
            .from('ventes')
            .update({
              article: article.nom,
              categorie: article.categorie,
              prix: article.prix,
              cout: article.cout,
              marge,
              marge_pourcent
            })
            .eq('id', vente.id)
            .eq('user_id', user.id);
        }
      }
      // Synchroniser le stock
      const { data: stockToUpdate, error: stockError } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', user.id)
        .eq('nom', nomRecherche);
      if (stockError) throw stockError;
      if (stockToUpdate && stockToUpdate.length > 0) {
        for (const stockItem of stockToUpdate) {
          await supabase
            .from('stock')
            .update({
              nom: article.nom,
              categorie: article.categorie,
              prixUnitaire: article.prix,
              cout: article.cout
            })
            .eq('id', stockItem.id)
            .eq('user_id', user.id);
        }
      }
      // Forcer la synchronisation globale
      await forceRefreshData();
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

  const deleteAllArticles = async () => {
    setError(null);
    try {
      console.log('Début de deleteAllArticles...');
      if (!supabase) {
        console.error('Supabase client non disponible');
        return;
      }
      if (!user) {
        console.error('Utilisateur non connecté');
        return;
      }
      console.log('Suppression de TOUTES les données pour user_id:', user.id);
      
      // Supprimer tous les articles
      const { error: errorInventaire } = await supabase
        .from('inventaire')
        .delete()
        .eq('user_id', user.id);
      if (errorInventaire) {
        console.error('Erreur suppression inventaire:', errorInventaire);
        throw errorInventaire;
      }
      console.log('Articles supprimés avec succès');
      
      // Supprimer toutes les ventes
      const { error: errorVentes } = await supabase
        .from('ventes')
        .delete()
        .eq('user_id', user.id);
      if (errorVentes) {
        console.error('Erreur suppression ventes:', errorVentes);
        throw errorVentes;
      }
      console.log('Ventes supprimées avec succès');
      
      // Supprimer tout le stock
      const { error: errorStock } = await supabase
        .from('stock')
        .delete()
        .eq('user_id', user.id);
      if (errorStock) {
        console.error('Erreur suppression stock:', errorStock);
        throw errorStock;
      }
      console.log('Stock supprimé avec succès');
      
      // Supprimer tous les boosts
      const { error: errorBoosts } = await supabase
        .from('boosts')
        .delete()
        .eq('user_id', user.id);
      if (errorBoosts) {
        console.error('Erreur suppression boosts:', errorBoosts);
        throw errorBoosts;
      }
      console.log('Boosts supprimés avec succès');
      
      // Vider tous les états locaux
      setArticles([]);
      setVentes([]);
      setStock([]);
      setBoosts([]);
      console.log('Tous les états locaux mis à jour');
    } catch (err: any) {
      console.error('Erreur complète:', err);
      setError('Erreur lors de la suppression de toutes les données.');
    }
  };

  // Fonction pour forcer la synchronisation des données
  const forceRefreshData = async () => {
    setError(null);
    try {
      console.log('Forçage de la synchronisation des données...');
      if (!supabase || !user) {
        console.error('Supabase ou utilisateur non disponible');
        return;
      }
      
      // Recharger toutes les données depuis Supabase
      const { data: articlesData, error: articlesError } = await supabase
        .from('inventaire')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: ventesData, error: ventesError } = await supabase
        .from('ventes')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: boostsData, error: boostsError } = await supabase
        .from('boosts')
        .select('*')
        .eq('user_id', user.id);
      
      if (articlesError || ventesError || stockError || boostsError) {
        throw articlesError || ventesError || stockError || boostsError;
      }
      
      // Mettre à jour tous les états
      setArticles(articlesData || []);
      setVentes(ventesData || []);
      setStock(stockData || []);
      setBoosts(boostsData || []);
      
      console.log('Synchronisation forcée terminée');
    } catch (err: any) {
      console.error('Erreur lors de la synchronisation:', err);
      setError('Erreur lors de la synchronisation des données.');
    }
  };

  // Actions pour les ventes
  const addVente = async (vente: Omit<Vente, 'id'>) => {
    setError(null);
    try {
      if (!supabase) return;
      const newVente = {
        article: vente.article,
        categorie: vente.categorie,
        acheteur: vente.acheteur,
        prix: vente.prix,
        cout: vente.cout,
        date_vente: vente.date,
        statut: vente.statut,
        frais_port: 0,
        frais_commission: 0,
        notes: '',
        user_id: user.id
      };
      const { data, error } = await supabase
        .from('ventes')
        .insert([newVente])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setVentes(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      setError('Erreur lors de l\'ajout de la vente.');
    }
  };

  const updateVente = async (vente: Vente) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('ventes')
        .update({
          ...vente,
          // marge et marge_pourcent sont générés automatiquement par la BDD
        })
        .eq('id', vente.id)
        .eq('user_id', user.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setVentes(prev => prev.map(v => v.id === vente.id ? data[0] : v));
      }
    } catch (err: any) {
      setError("Erreur lors de la modification de la vente.");
    }
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
      marge_pourcent: 0, // Sera calculé automatiquement
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
      marge_pourcent: Number(obj.marge_pourcent),
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

  // Fonctions pour les boosts
  const addBoost = async (boost: BoostFormData) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('boosts')
        .insert([{ ...boost, user_id: user.id }])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setBoosts(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      setError('Erreur lors de l\'ajout du boost.');
    }
  };

  const updateBoost = async (boost: Boost) => {
    setError(null);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('boosts')
        .update(boost)
        .eq('id', boost.id)
        .eq('user_id', user.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        setBoosts(prev => prev.map(b => b.id === boost.id ? data[0] : b));
      }
    } catch (err: any) {
      setError('Erreur lors de la mise à jour du boost.');
    }
  };

  const deleteBoost = async (id: number) => {
    setError(null);
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('boosts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setBoosts(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError('Erreur lors de la suppression du boost.');
    }
  };

  if (!isLoaded && !authLoading) return <div>Chargement des ventes...</div>;
  if (error) return <div style={{ color: 'red', padding: 16 }}>{error}</div>;

  return (
    <DataContext.Provider value={{
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      deleteAllArticles,
      forceRefreshData,
      ventes,
      addVente,
      updateVente,
      deleteVente,
      stock,
      updateStock,
      addStockItem,
      deleteStockItem,
      boosts,
      addBoost,
      updateBoost,
      deleteBoost,
      stats,
      vendreArticle,
      ajouterAuStock
    }}>
      {children}
    </DataContext.Provider>
  );
}; 
