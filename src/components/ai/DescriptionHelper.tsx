'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  Bot, 
  Copy, 
  Check, 
  RefreshCw,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Star,
  Target,
  BarChart3,
  Eye,
  Hash,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OptimizedDescription {
  title: string;
  description: string;
  keywords: string[];
  improvements: string[];
  seoScore: number;
  characterCount: number;
  wordCount: number;
  readability: 'excellent' | 'good' | 'fair' | 'poor';
}

interface DescriptionHelperProps {
  itemData?: any;
  className?: string;
}

export function DescriptionHelper({ itemData, className = "" }: DescriptionHelperProps) {
  const [formData, setFormData] = useState({
    name: itemData?.name || '',
    category: itemData?.category || '',
    brand: itemData?.brand || '',
    condition: itemData?.condition || 'good',
    price: itemData?.currentPrice || 0
  });
  
  const [currentDescription, setCurrentDescription] = useState('');
  const [optimized, setOptimized] = useState<OptimizedDescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'title' | 'description' | 'keywords'>('description');

  const optimizeDescription = async () => {
    if (!formData.name || !currentDescription.trim()) {
      setError('Veuillez remplir le nom de l\'article et la description actuelle');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation d'optimisation AI
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockOptimized: OptimizedDescription = {
        title: `${formData.name} - ${formData.brand ? formData.brand + ' ' : ''}${formData.condition === 'new' ? 'Neuf' : 'Comme neuf'} - ${formData.price}€`,
        description: `Magnifique ${formData.name.toLowerCase()} en excellent état ! ${formData.brand ? `Marque ${formData.brand} de qualité. ` : ''}${formData.condition === 'new' ? 'Article neuf avec étiquette. ' : 'Très peu porté, état impeccable. '}Parfait pour ${formData.category.toLowerCase()}. Livraison rapide et soignée. N'hésitez pas à me poser des questions !`,
        keywords: [
          formData.name.toLowerCase(),
          formData.brand?.toLowerCase() || '',
          formData.category.toLowerCase(),
          formData.condition === 'new' ? 'neuf' : 'comme neuf',
          'excellent état',
          'livraison rapide'
        ].filter(Boolean),
        improvements: [
          'Ajout de mots-clés populaires',
          'Description plus détaillée et engageante',
          'Optimisation pour le SEO Vinted',
          'Amélioration de la lisibilité'
        ],
        seoScore: Math.floor(Math.random() * 20) + 80, // 80-100
        characterCount: 280,
        wordCount: 45,
        readability: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'fair'
      };

      setOptimized(mockOptimized);
    } catch (err) {
      setError('Erreur lors de l\'optimisation de la description');
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

  const getReadabilityColor = (readability: string) => {
    switch (readability) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Assistant Description AI</h3>
          <p className="text-sm text-slate-600">Optimisez vos descriptions pour plus de ventes</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-600">Claude AI</span>
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Ex: Vêtements femmes"
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

      {/* Current Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Description actuelle *</label>
        <textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder="Entrez votre description actuelle..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{currentDescription.length} caractères</span>
          <span>{currentDescription.split(' ').filter(word => word.length > 0).length} mots</span>
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

      {/* Optimize Button */}
      <Button
        onClick={optimizeDescription}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mb-6"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Zap className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Optimisation en cours...' : 'Optimiser avec AI'}
      </Button>

      {/* Results */}
      <AnimatePresence>
        {optimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* SEO Score */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">Score SEO</h4>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span className={`font-bold text-lg ${getSeoScoreColor(optimized.seoScore)}`}>
                    {optimized.seoScore}/100
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    optimized.seoScore >= 90 ? 'bg-green-500' : 
                    optimized.seoScore >= 70 ? 'bg-blue-500' : 
                    optimized.seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${optimized.seoScore}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-slate-600">Caractères</div>
                  <div className="font-bold text-slate-800">{optimized.characterCount}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Mots</div>
                  <div className="font-bold text-slate-800">{optimized.wordCount}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Lisibilité</div>
                  <div className={`font-bold px-2 py-1 rounded text-xs ${getReadabilityColor(optimized.readability)}`}>
                    {optimized.readability}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex space-x-8">
                {[
                  { id: 'title', label: 'Titre optimisé', icon: <Target className="w-4 h-4" /> },
                  { id: 'description', label: 'Description', icon: <FileText className="w-4 h-4" /> },
                  { id: 'keywords', label: 'Mots-clés', icon: <Hash className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'title' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-medium text-slate-800 mb-2">Titre optimisé</h5>
                    <p className="text-slate-700 mb-3">{optimized.title}</p>
                    <Button
                      onClick={() => copyToClipboard(optimized.title, 'title')}
                      variant="outline"
                      size="sm"
                      className="border-slate-300"
                    >
                      {copied === 'title' ? (
                        <Check className="w-3 h-3 mr-2" />
                      ) : (
                        <Copy className="w-3 h-3 mr-2" />
                      )}
                      Copier le titre
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-medium text-slate-800 mb-2">Description optimisée</h5>
                    <p className="text-slate-700 mb-3 whitespace-pre-wrap">{optimized.description}</p>
                    <Button
                      onClick={() => copyToClipboard(optimized.description, 'description')}
                      variant="outline"
                      size="sm"
                      className="border-slate-300"
                    >
                      {copied === 'description' ? (
                        <Check className="w-3 h-3 mr-2" />
                      ) : (
                        <Copy className="w-3 h-3 mr-2" />
                      )}
                      Copier la description
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h5 className="font-medium text-slate-800 mb-2">Mots-clés recommandés</h5>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {optimized.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(optimized.keywords.join(', '), 'keywords')}
                      variant="outline"
                      size="sm"
                      className="border-slate-300"
                    >
                      {copied === 'keywords' ? (
                        <Check className="w-3 h-3 mr-2" />
                      ) : (
                        <Copy className="w-3 h-3 mr-2" />
                      )}
                      Copier les mots-clés
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Improvements */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Améliorations apportées
              </h5>
              <ul className="space-y-2">
                {optimized.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Cette optimisation vous a-t-elle été utile ?</span>
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