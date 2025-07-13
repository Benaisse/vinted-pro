'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Copy, 
  X,
  Sparkles,
  Target,
  BarChart3,
  Package,
  Eye
} from 'lucide-react'
import { 
  getPriceRecommendation, 
  getSalesForecast, 
  detectDuplicates,
  generateStockAlerts,
  analyzeMarketTrends,
  type PriceRecommendation,
  type SalesForecast,
  type DuplicateDetection,
  type StockAlert
} from '@/lib/ai'
import toast from 'react-hot-toast'

interface AIFeaturesProps {
  inventory: any[]
  salesHistory: any[]
}

export function AIFeatures({ inventory, salesHistory }: AIFeaturesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [priceData, setPriceData] = useState<PriceRecommendation | null>(null)
  const [forecastData, setForecastData] = useState<SalesForecast | null>(null)
  const [duplicateData, setDuplicateData] = useState<DuplicateDetection | null>(null)
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
  const [marketTrends, setMarketTrends] = useState<string>('')

  // États pour les formulaires
  const [priceForm, setPriceForm] = useState({
    title: '',
    category: '',
    condition: '',
    brand: '',
    currentPrice: ''
  })

  const [forecastForm, setForecastForm] = useState({
    category: ''
  })

  const handlePriceRecommendation = async () => {
    if (!priceForm.title || !priceForm.currentPrice) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)
    try {
      const result = await getPriceRecommendation(
        priceForm.title,
        priceForm.category,
        priceForm.condition,
        priceForm.brand,
        parseFloat(priceForm.currentPrice),
        salesHistory
      )
      setPriceData(result)
      toast.success('Recommandation générée !')
    } catch (error) {
      toast.error('Erreur lors de la génération de la recommandation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalesForecast = async () => {
    if (!forecastForm.category) {
      toast.error('Veuillez sélectionner une catégorie')
      return
    }

    setIsLoading(true)
    try {
      const result = await getSalesForecast(salesHistory, forecastForm.category)
      setForecastData(result)
      toast.success('Prévision générée !')
    } catch (error) {
      toast.error('Erreur lors de la génération de la prévision')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicateDetection = async () => {
    setIsLoading(true)
    try {
      // Utilise le premier article comme exemple
      const currentItem = inventory[0]
      const result = await detectDuplicates(currentItem, inventory)
      setDuplicateData(result)
      toast.success('Analyse des doublons terminée !')
    } catch (error) {
      toast.error('Erreur lors de la détection de doublons')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockAlerts = async () => {
    setIsLoading(true)
    try {
      const result = await generateStockAlerts(inventory, salesHistory)
      setStockAlerts(result)
      toast.success('Alertes de stock générées !')
    } catch (error) {
      toast.error('Erreur lors de la génération des alertes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarketTrends = async () => {
    setIsLoading(true)
    try {
      const result = await analyzeMarketTrends('Vêtements', salesHistory)
      setMarketTrends(result)
      toast.success('Analyse des tendances terminée !')
    } catch (error) {
      toast.error('Erreur lors de l\'analyse des tendances')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      id: 'price',
      title: 'Recommandation de Prix',
      description: 'Obtenez le prix optimal basé sur l\'historique et la concurrence',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      action: () => setActiveFeature('price')
    },
    {
      id: 'forecast',
      title: 'Prévision de Ventes',
      description: 'Prédisez vos ventes futures avec l\'IA',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      action: () => setActiveFeature('forecast')
    },
    {
      id: 'duplicates',
      title: 'Détection de Doublons',
      description: 'Identifiez automatiquement les articles similaires',
      icon: <Copy className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      action: () => setActiveFeature('duplicates')
    },
    {
      id: 'stock',
      title: 'Alertes de Stock',
      description: 'Recevez des alertes intelligentes sur votre inventaire',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      action: () => setActiveFeature('stock')
    },
    {
      id: 'trends',
      title: 'Tendances du Marché',
      description: 'Analysez les tendances actuelles du marché',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      action: () => setActiveFeature('trends')
    }
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Intelligence Artificielle</h2>
            <p className="text-gray-600">Optimisez votre business avec l'IA</p>
          </div>
        </div>
      </div>

      {/* Grille des fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
            onClick={feature.action}
          >
            <div className={`p-3 rounded-xl w-fit mb-4 ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {feature.description}
            </p>
            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Utiliser l'IA
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour les fonctionnalités */}
      {activeFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {features.find(f => f.id === activeFeature)?.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFeature(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {activeFeature === 'price' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Titre de l'article"
                      value={priceForm.title}
                      onChange={(e) => setPriceForm({...priceForm, title: e.target.value})}
                    />
                    <Input
                      placeholder="Catégorie"
                      value={priceForm.category}
                      onChange={(e) => setPriceForm({...priceForm, category: e.target.value})}
                    />
                    <Input
                      placeholder="État (neuf, bon, correct)"
                      value={priceForm.condition}
                      onChange={(e) => setPriceForm({...priceForm, condition: e.target.value})}
                    />
                    <Input
                      placeholder="Marque"
                      value={priceForm.brand}
                      onChange={(e) => setPriceForm({...priceForm, brand: e.target.value})}
                    />
                    <Input
                      placeholder="Prix actuel (€)"
                      type="number"
                      value={priceForm.currentPrice}
                      onChange={(e) => setPriceForm({...priceForm, currentPrice: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={handlePriceRecommendation}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Analyse en cours...' : 'Obtenir une recommandation'}
                  </Button>

                  {priceData && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Recommandation</h4>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {priceData.suggestedPrice}€
                      </div>
                      <p className="text-blue-800 text-sm mb-2">{priceData.reasoning}</p>
                      <p className="text-blue-700 text-sm">{priceData.marketAnalysis}</p>
                      <div className="mt-2 text-xs text-blue-600">
                        Confiance: {priceData.confidence}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeFeature === 'forecast' && (
                <div className="space-y-4">
                  <Input
                    placeholder="Catégorie à analyser"
                    value={forecastForm.category}
                    onChange={(e) => setForecastForm({...forecastForm, category: e.target.value})}
                  />
                  <Button 
                    onClick={handleSalesForecast}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Analyse en cours...' : 'Générer la prévision'}
                  </Button>

                  {forecastData && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-3">Prévisions</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-green-700">Semaine prochaine</div>
                          <div className="text-xl font-bold text-green-600">{forecastData.nextWeek}</div>
                        </div>
                        <div>
                          <div className="text-sm text-green-700">Mois prochain</div>
                          <div className="text-xl font-bold text-green-600">{forecastData.nextMonth}</div>
                        </div>
                      </div>
                      <div className="text-sm text-green-800">
                        <strong>Tendance:</strong> {forecastData.trend}
                      </div>
                      <div className="text-sm text-green-700 mt-2">
                        <strong>Facteurs:</strong> {forecastData.factors.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeFeature === 'duplicates' && (
                <div className="space-y-4">
                  <Button 
                    onClick={handleDuplicateDetection}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Analyse en cours...' : 'Détecter les doublons'}
                  </Button>

                  {duplicateData && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">Résultats</h4>
                      <div className="text-sm text-purple-800 mb-2">
                        <strong>Doublon détecté:</strong> {duplicateData.isDuplicate ? 'Oui' : 'Non'}
                      </div>
                      <div className="text-sm text-purple-700 mb-2">
                        <strong>Confiance:</strong> {duplicateData.confidence}%
                      </div>
                      {duplicateData.similarItems.length > 0 && (
                        <div>
                          <div className="text-sm text-purple-800 font-medium mb-2">Articles similaires:</div>
                          {duplicateData.similarItems.map((item, index) => (
                            <div key={index} className="text-sm text-purple-700 mb-1">
                              • {item.title} ({item.similarity}% de similarité)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeFeature === 'stock' && (
                <div className="space-y-4">
                  <Button 
                    onClick={handleStockAlerts}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Analyse en cours...' : 'Générer les alertes'}
                  </Button>

                  {stockAlerts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Alertes de Stock</h4>
                      {stockAlerts.map((alert, index) => (
                        <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-orange-900">{alert.itemName}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.urgency === 'high' ? 'bg-red-100 text-red-700' :
                              alert.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {alert.urgency}
                            </span>
                          </div>
                          <div className="text-sm text-orange-800 mb-1">
                            Stock actuel: {alert.currentStock}
                          </div>
                          <div className="text-sm text-orange-700">
                            {alert.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeFeature === 'trends' && (
                <div className="space-y-4">
                  <Button 
                    onClick={handleMarketTrends}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Analyse en cours...' : 'Analyser les tendances'}
                  </Button>

                  {marketTrends && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Tendances du Marché</h4>
                      <p className="text-red-800 text-sm leading-relaxed">
                        {marketTrends}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 