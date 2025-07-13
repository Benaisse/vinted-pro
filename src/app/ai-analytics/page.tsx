'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  AIInsightsCard, 
  PhotoAnalyzer, 
  PriceOptimizer, 
  DescriptionHelper, 
  TrendPredictor 
} from "@/components/ai";
import { 
  Bot, 
  Camera, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'insights' | 'photo' | 'price' | 'description' | 'trends'>('insights');

  const tabs = [
    { 
      id: 'insights', 
      label: 'Insights AI', 
      icon: <Bot className="w-5 h-5" />,
      description: 'Recommandations quotidiennes intelligentes'
    },
    { 
      id: 'photo', 
      label: 'Analyse Photos', 
      icon: <Camera className="w-5 h-5" />,
      description: 'Optimisez vos photos pour plus de ventes'
    },
    { 
      id: 'price', 
      label: 'Optimiseur Prix', 
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Prix optimal basé sur l\'analyse du marché'
    },
    { 
      id: 'description', 
      label: 'Assistant Description', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Descriptions optimisées pour le SEO'
    },
    { 
      id: 'trends', 
      label: 'Prédicteur Tendances', 
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Analysez l\'évolution du marché'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'insights':
        return <AIInsightsCard />;
      case 'photo':
        return <PhotoAnalyzer />;
      case 'price':
        return <PriceOptimizer />;
      case 'description':
        return <DescriptionHelper />;
      case 'trends':
        return <TrendPredictor />;
      default:
        return <AIInsightsCard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50"
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">AI Analytics</h1>
            </div>
            <p className="text-lg text-slate-600 mb-2">
              Optimisez vos ventes avec l'intelligence artificielle
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
              <Sparkles className="w-4 h-4" />
              <span>Propulsé par Claude AI</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/60 text-slate-700 hover:bg-white hover:shadow-md hover:scale-105'
                }`}
              >
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-slate-600 group-hover:text-indigo-600'
                }`}>
                  {tab.icon}
                </span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Tab Description */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              {tabs.find(t => t.id === activeTab)?.icon}
              <h2 className="text-xl font-semibold text-slate-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            <p className="text-slate-600">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>
        </motion.div>

        {/* Active Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {renderActiveComponent()}
          </motion.div>
        </AnimatePresence>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                features: ["Analyse automatique", "Priorisation intelligente", "Actions concrètes"],
                color: "from-blue-500 to-indigo-600"
              },
              {
                title: "Analyseur de Photos",
                description: "Optimisez vos photos pour plus de ventes",
                icon: "📸",
                features: ["Score de qualité", "Suggestions d'amélioration", "Analyse détaillée"],
                color: "from-green-500 to-emerald-600"
              },
              {
                title: "Optimiseur de Prix",
                description: "Prix optimal basé sur l'analyse du marché",
                icon: "💰",
                features: ["Analyse concurrentielle", "Prédictions de gain", "Recommandations"],
                color: "from-yellow-500 to-orange-600"
              },
              {
                title: "Assistant Description",
                description: "Descriptions optimisées pour le SEO",
                icon: "✍️",
                features: ["Optimisation SEO", "Mots-clés tendance", "Lisibilité améliorée"],
                color: "from-purple-500 to-pink-600"
              },
              {
                title: "Prédicteur de Tendances",
                description: "Analysez l'évolution du marché",
                icon: "📈",
                features: ["Prédictions de prix", "Analyse saisonnière", "Opportunités marché"],
                color: "from-red-500 to-pink-600"
              },
              {
                title: "Intelligence Artificielle",
                description: "Claude AI pour des insights avancés",
                icon: "🤖",
                features: ["Apprentissage continu", "Analyse contextuelle", "Recommandations personnalisées"],
                color: "from-indigo-500 to-purple-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                onClick={() => setActiveTab(feature.title.toLowerCase().includes('insights') ? 'insights' : 
                                          feature.title.toLowerCase().includes('photo') ? 'photo' :
                                          feature.title.toLowerCase().includes('prix') ? 'price' :
                                          feature.title.toLowerCase().includes('description') ? 'description' :
                                          feature.title.toLowerCase().includes('tendance') ? 'trends' : 'insights')}
              >
                <div className={`text-3xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
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
                <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600 font-medium">
                  <Target className="w-3 h-3" />
                  Cliquer pour essayer
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Analyses réalisées", value: "1,247", icon: <BarChart3 className="w-5 h-5" /> },
            { label: "Prix optimisés", value: "892", icon: <DollarSign className="w-5 h-5" /> },
            { label: "Photos analysées", value: "456", icon: <Camera className="w-5 h-5" /> },
            { label: "Gain estimé", value: "+2,847€", icon: <TrendingUp className="w-5 h-5" /> }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200 text-center hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
} 