import Anthropic from '@anthropic-ai/sdk';

// Types TypeScript
export interface ItemData {
  name: string;
  category: string;
  currentPrice: number;
  originalPrice?: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  brand?: string;
  description: string;
  photos?: string[];
  views?: number;
  likes?: number;
  timeListed?: number; // jours depuis la mise en ligne
  similarItems?: Array<{
    price: number;
    condition: string;
    sold: boolean;
    soldDate?: string;
  }>;
}

export interface PriceAnalysis {
  suggestedPrice: number;
  confidence: number;
  reasoning: string;
  marketTrend: 'rising' | 'stable' | 'declining';
  priceRange: {
    min: number;
    max: number;
  };
  recommendations: string[];
}

export interface PhotoAnalysis {
  score: number; // 1-10
  issues: string[];
  improvements: string[];
  strengths: string[];
  overallAssessment: string;
}

export interface OptimizedDescription {
  title: string;
  description: string;
  keywords: string[];
  improvements: string[];
  seoScore: number; // 1-10
}

export interface MarketInsights {
  trend: 'rising' | 'stable' | 'declining';
  demandLevel: 'high' | 'medium' | 'low';
  seasonality: string[];
  pricingStrategy: string;
  recommendations: string[];
  competitorAnalysis: {
    avgPrice: number;
    priceRange: string;
    marketShare: string;
  };
}

export interface PerformancePrediction {
  score: number; // 1-10
  confidence: number;
  timeToSell: number; // jours estimés
  factors: {
    positive: string[];
    negative: string[];
  };
  recommendations: string[];
}

export interface AIUsage {
  tokensUsed: number;
  cost: number;
  timestamp: Date;
  endpoint: string;
}

// Cache pour les réponses (24h)
interface CacheEntry {
  data: any;
  timestamp: Date;
  expiresAt: Date;
}

class ClaudeAIService {
  private client: Anthropic;
  private cache: Map<string, CacheEntry> = new Map();
  private usage: AIUsage[] = [];
  private rateLimitDelay = 1000; // 1 seconde entre les appels
  private lastCallTime = 0;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
    
    this.client = new Anthropic({
      apiKey,
    });
  }

  // Gestion du cache
  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getCachedResponse(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && new Date() < entry.expiresAt) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCachedResponse(key: string, data: any): void {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      expiresAt
    });
  }

  // Gestion du rate limiting
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastCall)
      );
    }
    
    this.lastCallTime = Date.now();
  }

  // Tracking de l'usage
  private trackUsage(endpoint: string, tokensUsed: number): void {
    const cost = (tokensUsed / 1000) * 0.003; // Claude Sonnet pricing
    this.usage.push({
      tokensUsed,
      cost,
      timestamp: new Date(),
      endpoint
    });
  }

  // Appel générique à Claude
  private async callClaude(prompt: string, systemPrompt: string): Promise<string> {
    await this.rateLimit();

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        system: systemPrompt,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        this.trackUsage('claude_call', response.usage.input_tokens + response.usage.output_tokens);
        return content.text;
      }
      
      throw new Error('Invalid response format from Claude');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 1. Analyse de prix
  async analyzePrice(itemData: ItemData): Promise<PriceAnalysis> {
    const cacheKey = this.getCacheKey('analyzePrice', itemData);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const systemPrompt = `Tu es un expert en pricing pour Vinted. Analyse les données d'un article et suggère un prix optimal. Réponds en JSON avec cette structure exacte:
    {
      "suggestedPrice": number,
      "confidence": number (0-1),
      "reasoning": "string",
      "marketTrend": "rising" | "stable" | "declining",
      "priceRange": {"min": number, "max": number},
      "recommendations": ["string"]
    }`;

    const prompt = `Analyse le prix optimal pour cet article Vinted:
    
    Nom: ${itemData.name}
    Catégorie: ${itemData.category}
    Prix actuel: ${itemData.currentPrice}€
    Prix original: ${itemData.originalPrice || 'N/A'}€
    État: ${itemData.condition}
    Marque: ${itemData.brand || 'N/A'}
    Description: ${itemData.description}
    Vues: ${itemData.views || 'N/A'}
    Likes: ${itemData.likes || 'N/A'}
    Temps en ligne: ${itemData.timeListed || 'N/A'} jours
    
    Articles similaires: ${JSON.stringify(itemData.similarItems || [])}
    
    Donne une analyse détaillée et un prix de vente recommandé.`;

    const response = await this.callClaude(prompt, systemPrompt);
    const analysis = JSON.parse(response);
    
    this.setCachedResponse(cacheKey, analysis);
    return analysis;
  }

  // 2. Analyse de photos
  async analyzePhoto(imageUrl: string): Promise<PhotoAnalysis> {
    const cacheKey = this.getCacheKey('analyzePhoto', imageUrl);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const systemPrompt = `Tu es un expert en photographie pour Vinted. Analyse la qualité des photos d'articles et donne des conseils d'amélioration. Réponds en JSON avec cette structure exacte:
    {
      "score": number (1-10),
      "issues": ["string"],
      "improvements": ["string"],
      "strengths": ["string"],
      "overallAssessment": "string"
    }`;

    const prompt = `Analyse cette photo d'article Vinted: ${imageUrl}
    
    Évalue:
    - Qualité de l'image
    - Éclairage
    - Cadrage
    - Arrière-plan
    - Présentation du produit
    - Conformité aux standards Vinted
    
    Donne un score de 1 à 10 et des recommandations spécifiques.`;

    const response = await this.callClaude(prompt, systemPrompt);
    const analysis = JSON.parse(response);
    
    this.setCachedResponse(cacheKey, analysis);
    return analysis;
  }

  // 3. Optimisation de description
  async optimizeDescription(currentDesc: string, itemData: ItemData): Promise<OptimizedDescription> {
    const cacheKey = this.getCacheKey('optimizeDescription', { currentDesc, itemData });
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const systemPrompt = `Tu es un expert en rédaction pour Vinted. Optimise les descriptions d'articles pour maximiser les ventes. Réponds en JSON avec cette structure exacte:
    {
      "title": "string",
      "description": "string",
      "keywords": ["string"],
      "improvements": ["string"],
      "seoScore": number (1-10)
    }`;

    const prompt = `Optimise cette description Vinted:
    
    Article: ${itemData.name}
    Catégorie: ${itemData.category}
    Marque: ${itemData.brand || 'N/A'}
    État: ${itemData.condition}
    Prix: ${itemData.currentPrice}€
    
    Description actuelle: ${currentDesc}
    
    Crée:
    1. Un titre optimisé
    2. Une description améliorée
    3. Des mots-clés pertinents
    4. Un score SEO de 1 à 10
    
    Utilise les meilleures pratiques Vinted pour maximiser la visibilité et les ventes.`;

    const response = await this.callClaude(prompt, systemPrompt);
    const optimization = JSON.parse(response);
    
    this.setCachedResponse(cacheKey, optimization);
    return optimization;
  }

  // 4. Insights du marché
  async getMarketInsights(category: string, period: string = '30d'): Promise<MarketInsights> {
    const cacheKey = this.getCacheKey('getMarketInsights', { category, period });
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const systemPrompt = `Tu es un analyste de marché spécialisé dans Vinted. Analyse les tendances et donne des insights stratégiques. Réponds en JSON avec cette structure exacte:
    {
      "trend": "rising" | "stable" | "declining",
      "demandLevel": "high" | "medium" | "low",
      "seasonality": ["string"],
      "pricingStrategy": "string",
      "recommendations": ["string"],
      "competitorAnalysis": {
        "avgPrice": number,
        "priceRange": "string",
        "marketShare": "string"
      }
    }`;

    const prompt = `Analyse le marché Vinted pour la catégorie "${category}" sur la période "${period}".
    
    Donne des insights sur:
    - Tendances actuelles
    - Niveau de demande
    - Saisonnalité
    - Stratégie de prix
    - Analyse concurrentielle
    - Recommandations spécifiques
    
    Base ton analyse sur les données de marché Vinted récentes.`;

    const response = await this.callClaude(prompt, systemPrompt);
    const insights = JSON.parse(response);
    
    this.setCachedResponse(cacheKey, insights);
    return insights;
  }

  // 5. Prédiction de performance
  async predictPerformance(itemData: ItemData): Promise<PerformancePrediction> {
    const cacheKey = this.getCacheKey('predictPerformance', itemData);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const systemPrompt = `Tu es un expert en prédiction de ventes Vinted. Évalue le potentiel de vente d'un article. Réponds en JSON avec cette structure exacte:
    {
      "score": number (1-10),
      "confidence": number (0-1),
      "timeToSell": number,
      "factors": {
        "positive": ["string"],
        "negative": ["string"]
      },
      "recommendations": ["string"]
    }`;

    const prompt = `Prédit la performance de vente de cet article Vinted:
    
    Nom: ${itemData.name}
    Catégorie: ${itemData.category}
    Prix: ${itemData.currentPrice}€
    État: ${itemData.condition}
    Marque: ${itemData.brand || 'N/A'}
    Description: ${itemData.description}
    Vues: ${itemData.views || 'N/A'}
    Likes: ${itemData.likes || 'N/A'}
    Temps en ligne: ${itemData.timeListed || 'N/A'} jours
    
    Donne:
    1. Un score de 1 à 10
    2. Le temps estimé de vente (en jours)
    3. Les facteurs positifs et négatifs
    4. Des recommandations d'amélioration
    
    Base ta prédiction sur les patterns de vente Vinted.`;

    const response = await this.callClaude(prompt, systemPrompt);
    const prediction = JSON.parse(response);
    
    this.setCachedResponse(cacheKey, prediction);
    return prediction;
  }

  // Utilitaires
  getUsageStats(): { totalTokens: number; totalCost: number; callsByEndpoint: Record<string, number> } {
    const totalTokens = this.usage.reduce((sum, u) => sum + u.tokensUsed, 0);
    const totalCost = this.usage.reduce((sum, u) => sum + u.cost, 0);
    
    const callsByEndpoint = this.usage.reduce((acc, u) => {
      acc[u.endpoint] = (acc[u.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalTokens, totalCost, callsByEndpoint };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Instance singleton
let claudeService: ClaudeAIService | null = null;

export function getClaudeService(): ClaudeAIService {
  if (!claudeService) {
    claudeService = new ClaudeAIService();
  }
  return claudeService;
}

export default ClaudeAIService; 