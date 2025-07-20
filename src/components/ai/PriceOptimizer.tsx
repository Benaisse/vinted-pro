'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Plus,
  Target,
  BarChart3,
  Sparkles,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Star,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PriceAnalysis {
  suggestedPrice: number;
  confidence: number;
  reasoning: string;
  marketTrend: 'rising' | 'stable' | 'declining';
  priceRange: {
    min: number;
    max: number;
  };
  recommendations: string[];
  marketData: {
    avgPrice: number;
    competitorCount: number;
    demandLevel: 'high' | 'medium' | 'low';
    seasonality: string;
  };
  potentialGain: {
    conservative: number;
    optimistic: number;
    percentage: number;
  };
}

interface PriceOptimizerProps {
  itemData?: any;
  className?: string;
}

export function PriceOptimizer({ itemData, className = "" }: PriceOptimizerProps) {
  const [formData, setFormData] = useState({
    name: itemData?.name || '',
    category: itemData?.category || '',
    currentPrice: itemData?.currentPrice || 0,
    originalPrice: itemData?.originalPrice || 0,
    condition: itemData?.condition || 'good',
    brand: itemData?.brand || '',
    description: itemData?.description || ''
  });
  
  const [analysis, setAnalysis] = useState<PriceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const analyzePrice = async () => {
    if (!formData.name || !formData.category || !formData.currentPrice) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation d'analyse AI
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const currentPrice = formData.currentPrice;
      const suggestedPrice = currentPrice + (Math.random() * 10 - 2); // ±5€ variation
      const percentage = ((suggestedPrice - currentPrice) / currentPrice) * 100;
      
      const mockAnalysis: PriceAnalysis = {
        suggestedPrice: Math.round(suggestedPrice * 10) / 10,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        reasoning: `Basé sur l'analyse de ${Math.floor(Math.random() * 50) + 20} articles similaires, votre prix actuel de ${currentPrice}€ est ${suggestedPrice > currentPrice ? 'sous-évalué' : 'légèrement élevé'}. Le marché montre une tendance ${Math.random() > 0.5 ? 'positive' : 'stable'} pour cette catégorie.`,
        marketTrend: Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining',
        priceRange: {
          min: Math.round((currentPrice * 0.85) * 10) / 10,
          max: Math.round((currentPrice * 1.25) * 10) / 10
        },
        recommendations: [
          'Attendre 2-3 jours pour voir l\'évolution du marché',
          'Ajouter des mots-clés populaires dans la description',
          'Améliorer la qualité des photos',
          'Considérer un prix de départ légèrement plus bas'
        ],
        marketData: {
          avgPrice: Math.round((currentPrice * (0.9 + Math.random() * 0.2)) * 10) / 10,
          competitorCount: Math.floor(Math.random() * 20) + 5,
          demandLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
          seasonality: Math.random() > 0.5 ? 'Saison haute' : 'Saison basse'
        },
        potentialGain: {
          conservative: Math.round((suggestedPrice - currentPrice) * 0.7 * 10) / 10,
          optimistic: Math.round((suggestedPrice - currentPrice) * 1.3 * 10) / 10,
          percentage: Math.round(percentage * 10) / 10
        }
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Erreur lors de l\'analyse de prix');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('recommendations');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'rising': return 'Hausse';
      case 'declining': return 'Baisse';
      default: return 'Stable';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Optimiseur de Prix AI</h3>
          <p className="text-sm text-slate-600">Prix optimal basé sur l'analyse du marché</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-600">Assistant IA</span>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'article *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Robe Zara fleurie"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie *</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Ex: Vêtements femmes"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix actuel (€) *</label>
          <Input
            type="number"
            value={formData.currentPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
            placeholder="25"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix original (€)</label>
          <Input
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
            placeholder="50"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Marque</label>
          <Input
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            placeholder="Ex: Zara"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">État</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="new">Neuf</option>
            <option value="like_new">Comme neuf</option>
            <option value="good">Bon</option>
            <option value="fair">Correct</option>
            <option value="poor">Usé</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Analyze Button */}
      <Button
        onClick={analyzePrice}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mb-6"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Zap className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Analyse en cours...' : 'Analyser le prix optimal'}
      </Button>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Recommendation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-800">Prix recommandé</h4>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-slate-600">
                    {analysis.confidence}% confiance
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-indigo-600">
                  {analysis.suggestedPrice}€
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    analysis.potentialGain.percentage > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analysis.potentialGain.percentage > 0 ? '+' : ''}{analysis.potentialGain.percentage}%
                  </div>
                  <div className="text-sm text-slate-600">
                    vs {formData.currentPrice}€ actuel
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                {getTrendIcon(analysis.marketTrend)}
                <span className="text-sm text-slate-600">
                  Tendance du marché: {getTrendText(analysis.marketTrend)}
                </span>
              </div>
              
              <p className="text-sm text-slate-600">{analysis.reasoning}</p>
            </div>

            {/* Price Range & Market Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Fourchette de prix
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Minimum</span>
                    <span className="font-medium text-red-600">{analysis.priceRange.min}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Maximum</span>
                    <span className="font-medium text-green-600">{analysis.priceRange.max}€</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Données marché
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Prix moyen</span>
                    <span className="font-medium text-slate-800">{analysis.marketData.avgPrice}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Concurrents</span>
                    <span className="font-medium text-slate-800">{analysis.marketData.competitorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Demande</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${getDemandColor(analysis.marketData.demandLevel)}`}>
                      {analysis.marketData.demandLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Potential Gain */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h5 className="font-medium text-green-800 mb-3">Gain potentiel</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-green-600">Conservateur</div>
                  <div className="text-lg font-bold text-green-700">+{analysis.potentialGain.conservative}€</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-600">Optimiste</div>
                  <div className="text-lg font-bold text-green-700">+{analysis.potentialGain.optimistic}€</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-medium text-blue-800 mb-3">Recommandations</h5>
              <ul className="space-y-2 mb-4">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {rec}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => copyToClipboard(analysis.recommendations.join('\n'))}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {copied === 'recommendations' ? (
                  <Check className="w-3 h-3 mr-2" />
                ) : (
                  <Copy className="w-3 h-3 mr-2" />
                )}
                Copier les recommandations
              </Button>
            </div>

            {/* Feedback */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Cette analyse vous a-t-elle été utile ?</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeedback('up')}
                  className={`p-2 rounded-lg transition-colors ${
                    feedback === 'up' 
                      ? 'bg-green-100 text-green-600' 
                      : 'hover:bg-slate-100 text-slate-400 hover:text-green-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFeedback('down')}
                  className={`p-2 rounded-lg transition-colors ${
                    feedback === 'down' 
                      ? 'bg-red-100 text-red-600' 
                      : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 