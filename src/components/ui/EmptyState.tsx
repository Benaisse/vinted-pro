'use client'

import { motion } from "framer-motion";
import { Button } from "./button";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Search,
  FileText,
  Users
} from "lucide-react";

interface EmptyStateProps {
  type?: "inventory" | "sales" | "analytics" | "stock" | "search" | "custom";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  type = "custom",
  title,
  description,
  action,
  illustration,
  className = ""
}: EmptyStateProps) {
  const defaultIllustrations = {
    inventory: (
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
        <Package className="w-12 h-12 text-blue-600" />
      </div>
    ),
    sales: (
      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
        <ShoppingCart className="w-12 h-12 text-green-600" />
      </div>
    ),
    analytics: (
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
        <TrendingUp className="w-12 h-12 text-purple-600" />
      </div>
    ),
    stock: (
      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-orange-600" />
      </div>
    ),
    search: (
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center">
        <Search className="w-12 h-12 text-gray-600" />
      </div>
    ),
    custom: (
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
        <FileText className="w-12 h-12 text-indigo-600" />
      </div>
    )
  };

  const icon = illustration || defaultIllustrations[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        {icon}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="text-xl font-semibold text-slate-800 mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="text-slate-600 mb-6 max-w-md"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        >
          <Button
            onClick={action.onClick}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {action.icon || <Plus className="w-4 h-4" />}
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Composants spécialisés pour différents types d'états vides
export function EmptyInventory({ action }: { action?: () => void }) {
  return (
    <EmptyState
      type="inventory"
      title="Aucun article dans l'inventaire"
      description="Commencez par ajouter votre premier article pour démarrer votre activité sur Vinted."
      action={action ? {
        label: "Ajouter un article",
        onClick: action,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
    />
  );
}

export function EmptySales({ action }: { action?: () => void }) {
  return (
    <EmptyState
      type="sales"
      title="Aucune vente enregistrée"
      description="Vos ventes apparaîtront ici une fois que vous aurez effectué vos premières transactions."
      action={action ? {
        label: "Ajouter une vente",
        onClick: action,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
    />
  );
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      type="analytics"
      title="Aucune donnée d'analyse"
      description="Les analyses et statistiques apparaîtront ici une fois que vous aurez des données à analyser."
    />
  );
}

export function EmptyStock({ action }: { action?: () => void }) {
  return (
    <EmptyState
      type="stock"
      title="Aucun article en stock"
      description="Ajoutez des articles à votre stock pour commencer à gérer vos inventaires."
      action={action ? {
        label: "Ajouter au stock",
        onClick: action,
        icon: <Plus className="w-4 h-4" />
      } : undefined}
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      type="search"
      title={`Aucun résultat pour "${query}"`}
      description="Essayez de modifier vos critères de recherche ou d'utiliser des termes différents."
    />
  );
} 