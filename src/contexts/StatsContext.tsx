'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useData } from "./DataContext";
import type { DataContextType } from "./DataContext";

// 1. Définir l'interface des stats
export interface Stats {
  totalVentes: number;
  totalRevenus: number;
  totalArticles: number;
  stockCritique: number;
  isLoading?: boolean;
}

// 2. Valeurs par défaut (pour le chargement ou l'absence de données)
export const defaultStats: Stats = {
  totalVentes: 0,
  totalRevenus: 0,
  totalArticles: 0,
  stockCritique: 0,
  isLoading: true,
};

// 3. Créer le contexte
const StatsContext = createContext<Stats>(defaultStats);

// 4. Provider
export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Stats>(defaultStats);
  let dataContext: DataContextType = {
    articles: [],
    addArticle: () => {},
    updateArticle: () => {},
    deleteArticle: () => {},
    ventes: [],
    addVente: () => {},
    updateVente: () => {},
    deleteVente: () => {},
    stock: [],
    updateStock: () => {},
    addStockItem: () => {},
    deleteStockItem: () => {},
    stats: {
      totalArticles: 0,
      totalVentes: 0,
      totalRevenus: 0,
      totalMarge: 0,
      articlesEnVente: 0,
      articlesVendus: 0,
      stockFaible: 0,
      stockRupture: 0,
    },
    vendreArticle: () => {},
    ajouterAuStock: () => {},
  };
  try {
    dataContext = useData();
  } catch (error) {
    // fallback déjà défini
  }
  const { articles, ventes, stock } = dataContext;

  useEffect(() => {
    if (!articles || !ventes || !stock) {
      setStats(defaultStats);
      return;
    }
    const totalVentes = ventes.length;
    const totalRevenus = ventes.reduce((sum: number, vente: any) => sum + (vente.prix || 0), 0);
    const totalArticles = articles.length;
    const stockCritique = stock.filter((item: any) => item.statut === 'Faible' || item.statut === 'Rupture').length;
    setStats({
      totalVentes,
      totalRevenus,
      totalArticles,
      stockCritique,
      isLoading: false,
    });
  }, [articles, ventes, stock]);

  return (
    <StatsContext.Provider value={stats}>
      {children}
    </StatsContext.Provider>
  );
}

// 5. Hook d'accès sécurisé
export function useStats() {
  const context = useContext(StatsContext);
  if (!context) {
    // Gestion d'erreur explicite
    return defaultStats;
  }
  return context;
} 