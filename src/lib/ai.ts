'use server'

// Supprimer l'import et l'initialisation Anthropic

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
    const apiKey = process.env.GEMINI_API_KEY;
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
`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Erreur lors de la recommandation de prix (Gemini):', error);
    return {
      suggestedPrice: currentPrice,
      reasoning: 'Erreur lors de l\'analyse',
      marketAnalysis: 'Données insuffisantes',
      confidence: 0
    };
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
    const apiKey = process.env.GEMINI_API_KEY;
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
`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Erreur lors de la prédiction des ventes (Gemini):', error);
    return {
      nextWeek: 0,
      nextMonth: 0,
      trend: 'stable',
      factors: ['Données insuffisantes']
    };
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
    const apiKey = process.env.GEMINI_API_KEY;
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
`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Erreur lors de la détection de doublons (Gemini):', error);
    return {
      isDuplicate: false,
      confidence: 0,
      similarItems: []
    };
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
    const apiKey = process.env.GEMINI_API_KEY;
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
`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Erreur lors de la génération d\'alertes (Gemini):', error);
    return [];
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
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `
Analyse les tendances du marché pour la catégorie "${category}" basées sur ces données de ventes :

${JSON.stringify(salesData)}

Donne une analyse concise et actionable en français.
`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des tendances (Gemini):', error);
    return 'Impossible d\'analyser les tendances du marché.';
  }
} 