'use client'

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  color = "primary", 
  text,
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const colorClasses = {
    primary: "text-indigo-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]}`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`text-sm ${colorClasses[color]} text-center`}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}

// Variante pour les cartes de chargement
export function CardLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" text="Chargement..." />
    </div>
  );
}

// Variante pour les boutons
export function ButtonLoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="w-4 h-4 text-white" />
    </motion.div>
  );
} 