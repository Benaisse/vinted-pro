'use client'

import React, { createContext, useContext, useState } from "react";
import { Article } from "@/components/ArticleFormModal";
import { inventaire as inventaireData } from "@/data/inventaire";

interface ArticlesContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function useArticles() {
  const ctx = useContext(ArticlesContext);
  if (!ctx) throw new Error("useArticles must be used within ArticlesProvider");
  return ctx;
}

export const ArticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>(inventaireData);

  const addArticle = (article: Article) => {
    setArticles(prev => [
      { ...article, id: Date.now(), dateAjout: new Date().toLocaleDateString('fr-FR'), vues: 0, likes: 0 },
      ...prev
    ]);
  };

  const updateArticle = (article: Article) => {
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, ...article } : a));
  };

  const deleteArticle = (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
}; 