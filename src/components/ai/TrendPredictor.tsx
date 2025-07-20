'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Target,
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
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MarketTrend {
  category: string;
  currentTrend: 'rising' | 'stable' | 'declining';
  confidence: number;
  prediction: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  insights: string[];
  recommendations: string[];
  marketData: {
    avgPrice: number;
    volume: number;
    competition: number;
    seasonality: string;
  };
  opportunities: {
    timing: string;
    pricing: string;
    marketing: string;
  };
}

interface TrendPredictorProps {
  itemData?: any;
  className?: string;
}

export function TrendPredictor({ itemData, className = "" }: TrendPredictorProps) {
  const [searchCategory, setSearchCategory] = useState(itemData?.category || '');
  const [trend, setTrend] = useState<MarketTrend | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const analyzeTrend = async () => {
    if (!searchCategory.trim()) {
      setError('Veuillez entrer une catégorie à analyser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation d'analyse AI
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const trendType = Math.random() > 0.6 ? 'rising' : Math.random() > 0.3 ? 'stable' : 'declining';
      const basePrice = Math.floor(Math.random() * 50) + 20;
      
      const mockTrend: MarketTrend = {
        category: searchCategory,
        currentTrend: trendType,
        confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
        prediction: {
          nextWeek: trendType === 'rising' ? basePrice * 1.05 : trendType === 'declining' ? basePrice * 0.95 : basePrice,
          nextMonth: trendType === 'rising' ? basePrice * 1.15 : trendType === 'declining' ? basePrice * 0.85 : basePrice,
          nextQuarter: trendType === 'rising' ? basePrice * 1.25 : trendType === 'declining' ? basePrice * 0.75 : basePrice
        },
        insights: [
          `${searchCategory} connaît une ${trendType === 'rising' ? 'hausse' : trendType === 'declining' ? 'baisse' : 'stabilité'} de ${Math.floor(Math.random() * 20) + 10}% ce mois`,
          `La demande est ${Math.random() > 0.5 ? 'élevée' : 'modérée'} avec ${Math.floor(Math.random() * 30) + 10}% de croissance`,
          `Les prix moyens ont ${trendType === 'rising' ? 'augmenté' : trendType === 'declining' ? 'diminué' : 'stagné'} de ${Math.floor(Math.random() * 15) + 5}%`,
          `La concurrence est ${Math.random() > 0.5 ? 'intense' : 'modérée'} avec ${Math.floor(Math.random() * 50) + 20} vendeurs actifs`
        ],
        recommendations: [
          trendType === 'rising' ? 'Augmenter progressivement les prix' : 'Maintenir des prix compétitifs',
          'Optimiser les descriptions avec des mots-clés tendance',
          'Publier aux heures de pointe (19h-21h)',
          'Utiliser des photos de haute qualité'
        ],
        marketData: {
          avgPrice: Math.round(basePrice * (0.9 + Math.random() * 0.2) * 10) / 10,
          volume: Math.floor(Math.random() * 100) + 50,
          competition: Math.floor(Math.random() * 30) + 10,
          seasonality: Math.random() > 0.5 ? 'Saison haute' : 'Saison basse'
        },
        opportunities: {
          timing: trendType === 'rising' ? 'Vendre maintenant avant la saturation' : 'Attendre une amélioration du marché',
          pricing: trendType === 'rising' ? 'Prix premium possible' : 'Prix compétitifs recommandés',
          marketing: 'Mettre en avant les points forts et la qualité'
        }
      };

      setTrend(mockTrend);
    } catch (err) {
      setError('Erreur lors de l\'analyse des tendances');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600 bg-green-50 border-green-200';
      case 'declining': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'rising': return 'Hausse';
      case 'declining': return 'Baisse';
      default: return 'Stable';
    }
  };

  const getPredictionChange = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100;
    return {
      value: Math.round(change * 10) / 10,
      isPositive: change > 0
    };
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
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Prédicteur de Tendances AI</h3>
          <p className="text-sm text-slate-600">Analysez l'évolution du marché</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-600">Assistant IA</span>
        </div>
      </div>

      {/* Search Form */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="Ex: Vêtements femmes, Électronique, Livres..."
            className="w-full"
          />
        </div>
        <Button
          onClick={analyzeTrend}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </Button>
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

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <h4 className="text-lg font-medium text-slate-800 mb-2">Analyse en cours...</h4>
          <p className="text-sm text-slate-600">Assistant IA analyse les tendances du marché</p>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {trend && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Current Trend */}
            <div className={`rounded-xl p-6 border ${getTrendColor(trend.currentTrend)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTrendIcon(trend.currentTrend)}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">Tendance actuelle</h4>
                    <p className="text-sm text-slate-600">{trend.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">
                    {getTrendText(trend.currentTrend)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Star className="w-3 h-3" />
                    {trend.confidence}% confiance
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    trend.currentTrend === 'rising' ? 'bg-green-500' : 
                    trend.currentTrend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${trend.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Predictions */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Prédictions de prix
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { period: 'week', label: 'Semaine prochaine', value: trend.prediction.nextWeek },
                  { period: 'month', label: 'Mois prochain', value: trend.prediction.nextMonth },
                  { period: 'quarter', label: 'Trimestre prochain', value: trend.prediction.nextQuarter }
                ].map((pred) => {
                  const change = getPredictionChange(trend.marketData.avgPrice, pred.value);
                  return (
                    <div
                      key={pred.period}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        activePeriod === pred.period
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      onClick={() => setActivePeriod(pred.period as any)}
                    >
                      <div className="text-sm text-slate-600 mb-1">{pred.label}</div>
                      <div className="text-xl font-bold text-slate-800 mb-1">
                        {Math.round(pred.value)}€
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        change.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {change.isPositive ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {change.isPositive ? '+' : ''}{change.value}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Données marché
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Prix moyen</span>
                    <span className="font-medium text-slate-800">{trend.marketData.avgPrice}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Volume de ventes</span>
                    <span className="font-medium text-slate-800">{trend.marketData.volume}/jour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Concurrence</span>
                    <span className="font-medium text-slate-800">{trend.marketData.competition} vendeurs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Saisonnalité</span>
                    <span className="font-medium text-slate-800">{trend.marketData.seasonality}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Opportunités
                </h5>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Timing</div>
                    <div className="text-sm font-medium text-slate-800">{trend.opportunities.timing}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Prix</div>
                    <div className="text-sm font-medium text-slate-800">{trend.opportunities.pricing}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Marketing</div>
                    <div className="text-sm font-medium text-slate-800">{trend.opportunities.marketing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Insights AI
              </h5>
              <ul className="space-y-2 mb-4">
                {trend.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {insight}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => copyToClipboard(trend.insights.join('\n'), 'insights')}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {copied === 'insights' ? (
                  <Check className="w-3 h-3 mr-2" />
                ) : (
                  <Copy className="w-3 h-3 mr-2" />
                )}
                Copier les insights
              </Button>
            </div>

            {/* Recommendations */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h5 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommandations
              </h5>
              <ul className="space-y-2 mb-4">
                {trend.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    {rec}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => copyToClipboard(trend.recommendations.join('\n'), 'recommendations')}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100"
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