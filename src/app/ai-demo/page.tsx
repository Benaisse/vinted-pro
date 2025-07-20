'use client'

import React from 'react';
import { motion } from "framer-motion";
import { 
  AIInsightsCard, 
  PhotoAnalyzer, 
  PriceOptimizer, 
  DescriptionHelper, 
  TrendPredictor 
} from "@/components/ai";
import { Bot, Sparkles, Zap } from "lucide-react";

export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Démonstration AI</h1>
            </div>
            <p className="text-lg text-slate-600 mb-2">
              Découvrez les fonctionnalités AI de Vinted Pro
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <span>Propulsé par Assistant IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AIInsightsCard />
          </motion.div>

          {/* Photo Analyzer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PhotoAnalyzer />
          </motion.div>

          {/* Price Optimizer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PriceOptimizer />
          </motion.div>

          {/* Description Helper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DescriptionHelper />
          </motion.div>

          {/* Trend Predictor - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <TrendPredictor />
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Fonctionnalités AI disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Insights AI",
                description: "Recommandations quotidiennes basées sur vos données",
                icon: "💡",
                features: ["Analyse automatique", "Priorisation intelligente", "Actions concrètes"]
              },
              {
                title: "Analyseur de Photos",
                description: "Optimisez vos photos pour plus de ventes",
                icon: "📸",
                features: ["Score de qualité", "Suggestions d'amélioration", "Analyse détaillée"]
              },
              {
                title: "Optimiseur de Prix",
                description: "Prix optimal basé sur l'analyse du marché",
                icon: "💰",
                features: ["Analyse concurrentielle", "Prédictions de gain", "Recommandations"]
              },
              {
                title: "Assistant Description",
                description: "Descriptions optimisées pour le SEO",
                icon: "✍️",
                features: ["Optimisation SEO", "Mots-clés tendance", "Lisibilité améliorée"]
              },
              {
                title: "Prédicteur de Tendances",
                description: "Analysez l'évolution du marché",
                icon: "📈",
                features: ["Prédictions de prix", "Analyse saisonnière", "Opportunités marché"]
              },
              {
                title: "Intelligence Artificielle",
                description: "Claude AI pour des insights avancés",
                icon: "🤖",
                features: ["Apprentissage continu", "Analyse contextuelle", "Recommandations personnalisées"]
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-200 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1">
                  {feature.features.map((feat, featIndex) => (
                    <li key={featIndex} className="text-xs text-slate-500 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-indigo-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 