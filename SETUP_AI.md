# 🚀 Service AI Claude Intégré - Vinted Pro

## 📋 **Fonctionnalités AI Complètes**

### 🎯 **Service AI Principal** (`src/services/claudeAI.ts`)
- **Client Claude AI** configuré avec Anthropic SDK
- **Cache intelligent** (24h) pour optimiser les coûts
- **Rate limiting** automatique (1s entre appels)
- **Tracking des coûts** et usage des tokens
- **Gestion d'erreurs** robuste

### 🔧 **5 Fonctionnalités AI Principales**

#### 1. **Analyse de Prix** (`/api/ai/analyze-price`)
- Prix optimal suggéré avec confiance
- Tendance du marché (rising/stable/declining)
- Fourchette de prix recommandée
- Raisonnement détaillé et conseils

#### 2. **Analyse de Photos** (`/api/ai/analyze-photo`)
- Score de qualité (1-10)
- Points forts et problèmes identifiés
- Suggestions d'amélioration
- Évaluation globale

#### 3. **Optimisation de Descriptions** (`/api/ai/optimize-description`)
- Titre optimisé pour SEO
- Description améliorée
- Mots-clés pertinents
- Score SEO (1-10)

#### 4. **Insights du Marché** (`/api/ai/market-insights`)
- Tendances par catégorie
- Niveau de demande
- Analyse concurrentielle
- Saisonnalité et recommandations

#### 5. **Prédiction de Performance** (`/api/ai/predict-performance`)
- Score de vente (1-10)
- Temps de vente estimé
- Facteurs positifs/négatifs
- Recommandations d'amélioration

### 📊 **Interface AI Analytics** (`src/components/AIAnalytics.tsx`)
- **Interface moderne** avec onglets
- **Animations fluides** (Framer Motion)
- **Formulaires intelligents** avec validation
- **Résultats visuels** détaillés
- **Responsive design** complet

## 🛠️ **Installation et Configuration**

### 1. **Dépendances**
```bash
npm install @anthropic-ai/sdk
```

### 2. **Variables d'environnement** (`.env.local`)
```bash
# Claude AI API Key
CLAUDE_API_KEY=votre_clé_claude_ici

# Autres variables
NEXT_PUBLIC_APP_NAME=Vinted Pro
```

### 3. **Obtenir une clé API Claude**
- Allez sur [console.anthropic.com](https://console.anthropic.com)
- Créez un compte ou connectez-vous
- Générez une nouvelle clé API
- Copiez la clé dans `.env.local`

## 🎨 **Interface Utilisateur**

### **Page AI Analytics** (`/ai-analytics`)
- **5 onglets** pour chaque fonctionnalité
- **Formulaires pré-remplis** avec données existantes
- **Résultats en temps réel** avec animations
- **Design cohérent** avec l'application

### **Navigation**
- **Sidebar** : Nouvel élément "AI Analytics" avec badge "AI"
- **Header** : Bouton assistant AI pour chat rapide
- **Responsive** : Fonctionne sur mobile et desktop

## 🔌 **API Endpoints**

### **Analyse de Prix**
```typescript
POST /api/ai/analyze-price
{
  "name": "Robe Zara fleurie",
  "category": "Vêtements femmes",
  "currentPrice": 25,
  "condition": "good",
  "brand": "Zara"
}
```

### **Analyse de Photos**
```typescript
POST /api/ai/analyze-photo
{
  "imageUrl": "https://example.com/image.jpg"
}
```

### **Optimisation Description**
```typescript
POST /api/ai/optimize-description
{
  "currentDesc": "Belle robe...",
  "itemData": { "name": "...", "category": "..." }
}
```

### **Insights Marché**
```typescript
POST /api/ai/market-insights
{
  "category": "Vêtements femmes",
  "period": "30d"
}
```

### **Prédiction Performance**
```typescript
POST /api/ai/predict-performance
{
  "name": "Robe Zara",
  "category": "Vêtements femmes",
  "currentPrice": 25,
  "condition": "good"
}
```

### **Statistiques Usage**
```typescript
GET /api/ai/usage-stats
DELETE /api/ai/usage-stats  // Vide le cache
```

## 💰 **Gestion des Coûts**

### **Pricing Claude Sonnet**
- **Input tokens** : $0.003/1K tokens
- **Output tokens** : $0.015/1K tokens
- **Cache 24h** pour réduire les coûts
- **Tracking automatique** des dépenses

### **Optimisations**
- **Cache intelligent** par requête
- **Rate limiting** pour éviter les surcharges
- **Réponses structurées** pour réduire les tokens
- **Validation côté client** avant envoi

## 🔒 **Sécurité**

### **Protection des Données**
- ✅ Clé API côté serveur uniquement
- ✅ Validation des entrées
- ✅ Gestion d'erreurs sécurisée
- ✅ Pas d'exposition de données sensibles

### **Rate Limiting**
- **1 seconde** entre les appels
- **Cache** pour éviter les appels répétés
- **Gestion d'erreurs** robuste

## 📱 **Utilisation**

### **Via l'Interface**
1. Allez sur `/ai-analytics`
2. Choisissez l'onglet souhaité
3. Remplissez les informations
4. Cliquez sur "Analyser"
5. Consultez les résultats détaillés

### **Via l'API**
```typescript
import { getClaudeService } from '@/services/claudeAI';

const claudeService = getClaudeService();
const analysis = await claudeService.analyzePrice(itemData);
```

## 🚨 **Dépannage**

### **Erreurs Courantes**
1. **"Clé API non configurée"** → Vérifiez `.env.local`
2. **"Erreur API Claude"** → Vérifiez la clé et les quotas
3. **"Rate limit"** → Attendez 1 seconde entre les appels
4. **"Cache expiré"** → Les données sont automatiquement rechargées

### **Logs et Monitoring**
- **Console browser** : Erreurs côté client
- **Terminal Next.js** : Erreurs côté serveur
- **API usage stats** : Suivi des coûts et usage

## 🎯 **Exemples d'Utilisation**

### **Analyse de Prix**
```
Article: Robe Zara fleurie
Prix actuel: 25€
Résultat: 32€ (confiance 85%)
Tendance: Rising
Recommandations: [3 conseils spécifiques]
```

### **Optimisation Description**
```
Description actuelle: "Belle robe"
Résultat: 
- Titre optimisé: "Robe Zara fleurie - Taille M - État impeccable"
- Score SEO: 8/10
- Mots-clés: [robe, zara, fleurie, femme, été]
```

### **Prédiction Performance**
```
Article: Sneakers Nike
Résultat: Score 7/10, vente estimée en 15 jours
Facteurs positifs: [marque populaire, saison]
Facteurs négatifs: [prix élevé]
```

## 🔄 **Mise à Jour et Maintenance**

### **Mise à jour du Service**
```bash
npm update @anthropic-ai/sdk
```

### **Vider le Cache**
```typescript
const claudeService = getClaudeService();
claudeService.clearCache();
```

### **Vérifier l'Usage**
```typescript
const stats = claudeService.getUsageStats();
console.log('Total cost:', stats.totalCost);
console.log('Total tokens:', stats.totalTokens);
```

---

**🎉 Votre application Vinted Pro est maintenant équipée d'un service AI complet et professionnel !** 