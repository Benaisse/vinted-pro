'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Camera, 
  FileText, 
  Target,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsight {
  id: string;
  type: 'price' | 'photo' | 'description' | 'trend' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action: string;
  estimatedGain?: string;
  priority: number;
  timestamp: Date;
}

interface AIInsightsCardProps {
  itemData?: any;
  className?: string;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'price',
    title: 'Prix sous-évalué détecté',
    description: 'Votre robe Zara pourrait se vendre 25% plus cher selon les tendances actuelles du marché.',
    confidence: 87,
    impact: 'high',
    action: 'Augmenter le prix de 25€ à 32€',
    estimatedGain: '+7€ par vente',
    priority: 1,
    timestamp: new Date()
  },
  {
    id: '2',
    type: 'photo',
    title: 'Amélioration des photos recommandée',
    description: 'Vos photos actuelles ont un score de 6/10. Une meilleure éclairage pourrait augmenter vos ventes de 40%.',
    confidence: 73,
    impact: 'medium',
    action: 'Retirer les photos avec ombres et ajouter des photos en plein jour',
    estimatedGain: '+40% de vues',
    priority: 2,
    timestamp: new Date()
  },
  {
    id: '3',
    type: 'description',
    title: 'Description SEO optimisable',
    description: 'Votre description manque de mots-clés populaires. Optimisation possible pour +60% de visibilité.',
    confidence: 91,
    impact: 'high',
    action: 'Ajouter les mots-clés: "robe été", "zara", "taille M", "comme neuf"',
    estimatedGain: '+60% de visibilité',
    priority: 3,
    timestamp: new Date()
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'price': return <DollarSign className="w-4 h-4" />;
    case 'photo': return <Camera className="w-4 h-4" />;
    case 'description': return <FileText className="w-4 h-4" />;
    case 'trend': return <TrendingUp className="w-4 h-4" />;
    case 'performance': return <Target className="w-4 h-4" />;
    default: return <Bot className="w-4 h-4" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-slate-600 bg-slate-50 border-slate-200';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return 'text-green-600';
  if (confidence >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export function AIInsightsCard({ itemData, className = "" }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | null>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des insights AI
    const loadInsights = async () => {
      setLoading(true);
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setInsights(mockInsights.sort((a, b) => b.priority - a.priority));
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des insights AI');
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [itemData]);

  const handleFeedback = (insightId: string, type: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [insightId]: type }));
    // Ici vous pourriez envoyer le feedback à votre API
    console.log(`Feedback ${type} pour l'insight ${insightId}`);
  };

  const copyToClipboard = async (text: string, insightId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(insightId);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const retryLoad = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Insights AI</h3>
            <p className="text-sm text-slate-600">Analyse en cours...</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200 p-6 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Erreur AI</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        
        <Button 
          onClick={retryLoad}
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Insights AI</h3>
            <p className="text-sm text-slate-600">Recommandations intelligentes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-600">Claude AI</span>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-200 transition-all duration-200"
            >
              {/* Insight Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getImpactColor(insight.impact)}`}>
                    {getTypeIcon(insight.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{insight.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% confiance
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {insight.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setExpanded(expanded === insight.id ? null : insight.id)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  {expanded === insight.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Insight Description */}
              <p className="text-sm text-slate-600 mb-3">{insight.description}</p>

              {/* Action & Estimated Gain */}
              <div className="bg-white rounded-lg p-3 mb-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Action recommandée:</span>
                  {insight.estimatedGain && (
                    <span className="text-sm font-bold text-green-600">{insight.estimatedGain}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{insight.action}</p>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expanded === insight.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-200 pt-3 mt-3"
                  >
                    <div className="space-y-3">
                      {/* Confidence Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">Confiance AI</span>
                          <span className="text-xs font-medium text-slate-700">{insight.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              insight.confidence >= 80 ? 'bg-green-500' : 
                              insight.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Priority & Impact */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-slate-100 rounded-lg">
                          <div className="text-xs text-slate-600">Priorité</div>
                          <div className="text-sm font-bold text-slate-800">#{insight.priority}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-100 rounded-lg">
                          <div className="text-xs text-slate-600">Impact</div>
                          <div className={`text-sm font-bold capitalize ${
                            insight.impact === 'high' ? 'text-red-600' :
                            insight.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {insight.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(insight.action, insight.id)}
                    className="text-xs h-8"
                  >
                    {copied === insight.id ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    Copier
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFeedback(insight.id, 'up')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      feedback[insight.id] === 'up' 
                        ? 'bg-green-100 text-green-600' 
                        : 'hover:bg-slate-100 text-slate-400 hover:text-green-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(insight.id, 'down')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      feedback[insight.id] === 'down' 
                        ? 'bg-red-100 text-red-600' 
                        : 'hover:bg-slate-100 text-slate-400 hover:text-red-600'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          <span>{insights.length} insights générés</span>
        </div>
      </div>
    </motion.div>
  );
} 