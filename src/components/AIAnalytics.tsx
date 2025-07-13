'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  DollarSign, 
  Camera, 
  FileText, 
  TrendingUp, 
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  Zap,
  RefreshCw
} from "lucide-react";
import { ItemData, PriceAnalysis, PhotoAnalysis, OptimizedDescription, MarketInsights, PerformancePrediction } from '@/services/claudeAI';

interface AIAnalyticsProps {
  itemData?: ItemData;
  onClose?: () => void;
}

export function AIAnalytics({ itemData, onClose }: AIAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'price' | 'photo' | 'description' | 'market' | 'performance'>('price');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    price?: PriceAnalysis;
    photo?: PhotoAnalysis;
    description?: OptimizedDescription;
    market?: MarketInsights;
    performance?: PerformancePrediction;
  }>({});

  const [formData, setFormData] = useState<Partial<ItemData>>(itemData || {
    name: '',
    category: '',
    currentPrice: 0,
    condition: 'good',
    description: ''
  });

  const [imageUrl, setImageUrl] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');

  const tabs = [
    { id: 'price', label: 'Analyse Prix', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'photo', label: 'Analyse Photos', icon: <Camera className="w-4 h-4" /> },
    { id: 'description', label: 'Optimisation', icon: <FileText className="w-4 h-4" /> },
    { id: 'market', label: 'Insights Marché', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'performance', label: 'Prédiction', icon: <Target className="w-4 h-4" /> },
  ];

  const callAI = async (endpoint: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.success) {
        setResults(prev => ({ ...prev, [activeTab]: result.data }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`AI ${endpoint} error:`, error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePrice = () => {
    if (!formData.name || !formData.category || !formData.currentPrice) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    callAI('analyze-price', formData);
  };

  const handleAnalyzePhoto = () => {
    if (!imageUrl) {
      alert('Veuillez entrer une URL d\'image');
      return;
    }
    callAI('analyze-photo', { imageUrl });
  };

  const handleOptimizeDescription = () => {
    if (!currentDescription || !formData.name) {
      alert('Veuillez entrer une description et le nom de l\'article');
      return;
    }
    callAI('optimize-description', { currentDesc: currentDescription, itemData: formData });
  };

  const handleMarketInsights = () => {
    if (!formData.category) {
      alert('Veuillez entrer une catégorie');
      return;
    }
    callAI('market-insights', { category: formData.category, period: '30d' });
  };

  const handlePredictPerformance = () => {
    if (!formData.name || !formData.category) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    callAI('predict-performance', formData);
  };

  const renderPriceAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'article</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Robe Zara fleurie"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Ex: Vêtements femmes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix actuel (€)</label>
          <Input
            type="number"
            value={formData.currentPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
            placeholder="25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">État</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
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

      <Button 
        onClick={handleAnalyzePrice}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
        Analyser le prix optimal
      </Button>

      {results.price && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Analyse de prix</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">{results.price.suggestedPrice}€</span>
              <span className="text-sm text-slate-500">(Confiance: {Math.round(results.price.confidence * 100)}%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Tendance du marché</h4>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${
                  results.price.marketTrend === 'rising' ? 'text-green-600' : 
                  results.price.marketTrend === 'declining' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className="capitalize">{results.price.marketTrend}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Fourchette de prix</h4>
              <span className="text-sm">{results.price.priceRange.min}€ - {results.price.priceRange.max}€</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2">Raisonnement</h4>
            <p className="text-sm text-slate-600">{results.price.reasoning}</p>
          </div>

          <div>
            <h4 className="font-medium text-slate-700 mb-2">Recommandations</h4>
            <ul className="space-y-1">
              {results.price.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderPhotoAnalysis = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">URL de l'image</label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <Button 
        onClick={handleAnalyzePhoto}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
        Analyser la photo
      </Button>

      {results.photo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Analyse de photo</h3>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-indigo-600">{results.photo.score}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-700 mb-2">Points forts</h4>
              <ul className="space-y-1">
                {results.photo.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-700 mb-2">Problèmes</h4>
              <ul className="space-y-1">
                {results.photo.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2">Améliorations suggérées</h4>
            <ul className="space-y-1">
              {results.photo.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-slate-700 mb-2">Évaluation globale</h4>
            <p className="text-sm text-slate-600">{results.photo.overallAssessment}</p>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderDescriptionOptimization = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'article</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Robe Zara fleurie"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Ex: Vêtements femmes"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Description actuelle</label>
        <textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder="Entrez votre description actuelle..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
        />
      </div>

      <Button 
        onClick={handleOptimizeDescription}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
        Optimiser la description
      </Button>

      {results.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Description optimisée</h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium">SEO: {results.description.seoScore}/10</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Titre optimisé</h4>
              <p className="text-sm bg-slate-50 p-3 rounded-lg">{results.description.title}</p>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-2">Description améliorée</h4>
              <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{results.description.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-2">Mots-clés</h4>
              <div className="flex flex-wrap gap-2">
                {results.description.keywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-2">Améliorations apportées</h4>
              <ul className="space-y-1">
                {results.description.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderMarketInsights = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
        <Input
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Ex: Vêtements femmes, Chaussures, Accessoires..."
        />
      </div>

      <Button 
        onClick={handleMarketInsights}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
        Analyser le marché
      </Button>

      {results.market && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Insights du marché</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Tendance</h4>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${
                  results.market.trend === 'rising' ? 'text-green-600' : 
                  results.market.trend === 'declining' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <span className="capitalize">{results.market.trend}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Demande</h4>
              <span className="capitalize">{results.market.demandLevel}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2">Analyse concurrentielle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{results.market.competitorAnalysis.avgPrice}€</div>
                <div className="text-xs text-slate-500">Prix moyen</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-700">{results.market.competitorAnalysis.priceRange}</div>
                <div className="text-xs text-slate-500">Fourchette</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-700">{results.market.competitorAnalysis.marketShare}</div>
                <div className="text-xs text-slate-500">Part de marché</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-slate-700 mb-2">Saisonnalité</h4>
            <div className="flex flex-wrap gap-2">
              {results.market.seasonality.map((season, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {season}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-700 mb-2">Recommandations</h4>
            <ul className="space-y-1">
              {results.market.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderPerformancePrediction = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'article</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Robe Zara fleurie"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Ex: Vêtements femmes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Prix (€)</label>
          <Input
            type="number"
            value={formData.currentPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
            placeholder="25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">État</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
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

      <Button 
        onClick={handlePredictPerformance}
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
        Prédire la performance
      </Button>

      {results.performance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Prédiction de performance</h3>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-indigo-600">{results.performance.score}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Temps de vente estimé</h4>
              <div className="text-2xl font-bold text-green-600">{results.performance.timeToSell} jours</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Confiance</h4>
              <div className="text-2xl font-bold text-indigo-600">{Math.round(results.performance.confidence * 100)}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-700 mb-2">Facteurs positifs</h4>
              <ul className="space-y-1">
                {results.performance.factors.positive.map((factor, index) => (
                  <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-medium text-red-700 mb-2">Facteurs négatifs</h4>
              <ul className="space-y-1">
                {results.performance.factors.negative.map((factor, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-700 mb-2">Recommandations</h4>
            <ul className="space-y-1">
              {results.performance.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <Zap className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Analytics Vinted</h2>
              <p className="text-indigo-100 text-sm">Analysez et optimisez vos articles avec Claude AI</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'price' && renderPriceAnalysis()}
            {activeTab === 'photo' && renderPhotoAnalysis()}
            {activeTab === 'description' && renderDescriptionOptimization()}
            {activeTab === 'market' && renderMarketInsights()}
            {activeTab === 'performance' && renderPerformancePrediction()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 