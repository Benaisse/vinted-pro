'use server'

import { Anthropic } from '@anthropic-ai/sdk'

// Configuration de l'API Claude
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export interface PriceRecommendation {
  suggestedPrice: number
  reasoning: string
  marketAnalysis: string
  confidence: number
}

export interface SalesForecast {
  nextWeek: number
  nextMonth: number
  trend: 'up' | 'down' | 'stable'
  factors: string[]
}

export interface DuplicateDetection {
  isDuplicate: boolean
  confidence: number
  similarItems: Array<{
    id: string
    title: string
    similarity: number
  }>
}

export interface StockAlert {
  itemId: string
  itemName: string
  currentStock: number
  recommendedAction: string
  urgency: 'low' | 'medium' | 'high'
}

/**
 * Recommande un prix optimal basé sur l'historique et la concurrence
 */
export async function getPriceRecommendation(
  itemTitle: string,
  category: string,
  condition: string,
  brand: string,
  currentPrice: number,
  salesHistory: any[]
): Promise<PriceRecommendation> {
  try {
    const prompt = `
Tu es un expert en e-commerce spécialisé dans la revente sur Vinted. 
Analyse les données suivantes et recommande un prix optimal :

Article: ${itemTitle}
Catégorie: ${category}
État: ${condition}
Marque: ${brand}
Prix actuel: ${currentPrice}€
Historique des ventes: ${JSON.stringify(salesHistory)}

Donne ta réponse au format JSON:
{
  "suggestedPrice": number,
  "reasoning": "explication détaillée",
  "marketAnalysis": "analyse du marché",
  "confidence": number (0-100)
}
`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = JSON.parse(response.content[0].text)
    return result
  } catch (error) {
    console.error('Erreur lors de la recommandation de prix:', error)
    return {
      suggestedPrice: currentPrice,
      reasoning: 'Erreur lors de l\'analyse',
      marketAnalysis: 'Données insuffisantes',
      confidence: 0
    }
  }
}

/**
 * Prédit les ventes futures basées sur l'historique
 */
export async function getSalesForecast(
  salesHistory: any[],
  category: string
): Promise<SalesForecast> {
  try {
    const prompt = `
Analyse l'historique des ventes suivant et prédit les ventes futures :

Catégorie: ${category}
Historique: ${JSON.stringify(salesHistory)}

Donne ta réponse au format JSON:
{
  "nextWeek": number,
  "nextMonth": number,
  "trend": "up|down|stable",
  "factors": ["facteur1", "facteur2"]
}
`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = JSON.parse(response.content[0].text)
    return result
  } catch (error) {
    console.error('Erreur lors de la prédiction des ventes:', error)
    return {
      nextWeek: 0,
      nextMonth: 0,
      trend: 'stable',
      factors: ['Données insuffisantes']
    }
  }
}

/**
 * Détecte les doublons dans l'inventaire
 */
export async function detectDuplicates(
  currentItem: any,
  inventory: any[]
): Promise<DuplicateDetection> {
  try {
    const prompt = `
Analyse si cet article est un doublon dans l'inventaire :

Article actuel: ${JSON.stringify(currentItem)}
Inventaire complet: ${JSON.stringify(inventory)}

Donne ta réponse au format JSON:
{
  "isDuplicate": boolean,
  "confidence": number (0-100),
  "similarItems": [
    {
      "id": "string",
      "title": "string", 
      "similarity": number (0-100)
    }
  ]
}
`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = JSON.parse(response.content[0].text)
    return result
  } catch (error) {
    console.error('Erreur lors de la détection de doublons:', error)
    return {
      isDuplicate: false,
      confidence: 0,
      similarItems: []
    }
  }
}

/**
 * Génère des alertes de stock intelligentes
 */
export async function generateStockAlerts(
  inventory: any[],
  salesHistory: any[]
): Promise<StockAlert[]> {
  try {
    const prompt = `
Analyse l'inventaire et l'historique des ventes pour générer des alertes de stock intelligentes :

Inventaire: ${JSON.stringify(inventory)}
Historique des ventes: ${JSON.stringify(salesHistory)}

Donne ta réponse au format JSON:
[
  {
    "itemId": "string",
    "itemName": "string",
    "currentStock": number,
    "recommendedAction": "string",
    "urgency": "low|medium|high"
  }
]
`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = JSON.parse(response.content[0].text)
    return result
  } catch (error) {
    console.error('Erreur lors de la génération d\'alertes:', error)
    return []
  }
}

/**
 * Analyse les tendances du marché
 */
export async function analyzeMarketTrends(
  category: string,
  salesData: any[]
): Promise<string> {
  try {
    const prompt = `
Analyse les tendances du marché pour la catégorie "${category}" basées sur ces données de ventes :

${JSON.stringify(salesData)}

Donne une analyse concise et actionable en français.
`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    return response.content[0].text
  } catch (error) {
    console.error('Erreur lors de l\'analyse des tendances:', error)
    return 'Impossible d\'analyser les tendances du marché.'
  }
} 