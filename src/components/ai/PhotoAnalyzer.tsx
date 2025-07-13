'use client'

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Download,
  RotateCcw,
  ZoomIn,
  Eye,
  Sparkles,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoAnalysis {
  score: number;
  issues: string[];
  improvements: string[];
  strengths: string[];
  overallAssessment: string;
  suggestions: {
    lighting: string;
    composition: string;
    background: string;
    angle: string;
  };
}

interface PhotoAnalyzerProps {
  itemData?: any;
  className?: string;
}

export function PhotoAnalyzer({ itemData, className = "" }: PhotoAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Le fichier est trop volumineux. Taille maximale: 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setAnalysis(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale: 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setAnalysis(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const analyzePhoto = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      // Simulation d'analyse AI
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis: PhotoAnalysis = {
        score: Math.floor(Math.random() * 4) + 6, // 6-10
        issues: [
          'Éclairage insuffisant sur le côté gauche',
          'Arrière-plan encombré',
          'Angle de prise de vue peu optimal'
        ],
        improvements: [
          'Photographier en plein jour près d\'une fenêtre',
          'Utiliser un arrière-plan uni (mur blanc)',
          'Prendre la photo à hauteur d\'épaule'
        ],
        strengths: [
          'Produit bien centré',
          'Couleurs fidèles',
          'Résolution suffisante'
        ],
        overallAssessment: 'Photo correcte mais avec un potentiel d\'amélioration significatif. L\'éclairage et l\'arrière-plan sont les points à optimiser en priorité.',
        suggestions: {
          lighting: 'Utiliser la lumière naturelle du jour',
          composition: 'Centrer davantage le produit',
          background: 'Arrière-plan uni recommandé',
          angle: 'Angle de 45° pour plus de dynamisme'
        }
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Erreur lors de l\'analyse de la photo');
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('suggestions');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
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
          <Camera className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Analyseur de Photos AI</h3>
          <p className="text-sm text-slate-600">Optimisez vos photos avec Claude AI</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-600">Claude AI</span>
        </div>
      </div>

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">
            Glissez-déposez votre photo ici
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            ou cliquez pour sélectionner un fichier
          </p>
          <p className="text-xs text-slate-400">
            Formats supportés: JPG, PNG, WEBP • Taille max: 10MB
          </p>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

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

      {/* Photo Preview */}
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="relative">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-64 object-cover rounded-xl border border-slate-200"
            />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {selectedFile?.name}
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              onClick={analyzePhoto}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Bot className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Analyse en cours...' : 'Analyser avec AI'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Header */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">Score de qualité</h4>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreBg(analysis.score)}`}>
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/10
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    analysis.score >= 8 ? 'bg-green-500' : 
                    analysis.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.score * 10}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-slate-600">{analysis.overallAssessment}</p>
            </div>

            {/* Strengths & Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h5 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Points forts
                </h5>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Issues */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h5 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Problèmes détectés
                </h5>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Améliorations suggérées
              </h5>
              <ul className="space-y-2 mb-4">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => copyToClipboard(analysis.improvements.join('\n'))}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {copied === 'suggestions' ? (
                  <Check className="w-3 h-3 mr-2" />
                ) : (
                  <Copy className="w-3 h-3 mr-2" />
                )}
                Copier les suggestions
              </Button>
            </div>

            {/* Detailed Suggestions */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h5 className="font-medium text-slate-800 mb-3">Conseils détaillés</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium text-slate-700 mb-2">Éclairage</h6>
                  <p className="text-sm text-slate-600">{analysis.suggestions.lighting}</p>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-slate-700 mb-2">Composition</h6>
                  <p className="text-sm text-slate-600">{analysis.suggestions.composition}</p>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-slate-700 mb-2">Arrière-plan</h6>
                  <p className="text-sm text-slate-600">{analysis.suggestions.background}</p>
                </div>
                <div>
                  <h6 className="text-sm font-medium text-slate-700 mb-2">Angle</h6>
                  <p className="text-sm text-slate-600">{analysis.suggestions.angle}</p>
                </div>
              </div>
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