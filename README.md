# Vinted Pro Dashboard

Un dashboard professionnel moderne pour les vendeurs Vinted, construit avec Next.js, TypeScript, Tailwind CSS et shadcn/ui.

## 🚀 Fonctionnalités

### Header Component
- **Barre de recherche** avec icône et placeholder
- **Statistiques rapides** (ventes du jour, statut en ligne)
- **Actions rapides** (Ajouter article, Analytics) avec tooltips
- **Système de notifications avancé** avec :
  - Badge animé avec compteur
  - Filtres par type (Toutes, Ventes, IA, Stock)
  - Notifications colorées par priorité
  - Actions contextuelles
- **Messages/Chat** avec indicateur de nouveaux messages
- **Paramètres rapides** avec toggles
- **Menu utilisateur** avec :
  - Profil détaillé
  - Statistiques personnelles
  - Options de navigation
  - Indicateur de statut

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes
- **Lucide React** - Icônes
- **Radix UI** - Primitives d'accessibilité

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd vinted-pro
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🏗️ Structure du projet

```
vinted-pro/
├── src/
│   ├── app/
│   │   ├── globals.css          # Styles globaux
│   │   ├── layout.tsx           # Layout racine
│   │   └── page.tsx             # Page d'accueil
│   ├── components/
│   │   ├── Header.tsx           # Composant Header principal
│   │   └── ui/                  # Composants UI shadcn
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── avatar.tsx
│   │       └── dropdown-menu.tsx
│   └── lib/
│       └── utils.ts             # Utilitaires
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Composants UI

### Header
Le composant Header (`src/components/Header.tsx`) inclut :

- **Recherche** : Barre de recherche avec icône
- **Quick Stats** : Affichage des statistiques en temps réel
- **Quick Actions** : Boutons d'action avec tooltips
- **Notifications** : Système complet avec filtres et actions
- **Messages** : Interface de messagerie
- **Paramètres** : Accès rapide aux paramètres
- **User Menu** : Menu utilisateur avec profil et statistiques

### Composants shadcn/ui
- **Button** : Boutons avec variants et tailles
- **Input** : Champs de saisie stylisés
- **Avatar** : Composant avatar avec fallback
- **DropdownMenu** : Menus déroulants accessibles

## 🎯 Fonctionnalités détaillées

### Système de notifications
- **Types de notifications** : IA, Ventes, Stock, Engagement
- **Priorités** : Urgent (rouge), Succès (vert), Attention (orange), Info (bleu)
- **Actions contextuelles** : Boutons d'action spécifiques à chaque notification
- **Filtres** : Navigation par type de notification
- **Animations** : Badge animé et transitions fluides

### Interface responsive
- **Mobile-first** : Design adaptatif
- **Breakpoints** : Optimisé pour tous les écrans
- **Masquage intelligent** : Éléments cachés sur petits écrans

### Accessibilité
- **Navigation clavier** : Support complet du clavier
- **ARIA labels** : Labels d'accessibilité
- **Focus management** : Gestion du focus
- **Contraste** : Couleurs respectant les standards WCAG

## 🔧 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
```

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `src/app/globals.css` avec des variables CSS :

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... autres variables */
}
```

### Thème sombre
Le projet supporte le mode sombre avec les variables CSS correspondantes dans la classe `.dark`.

## 📱 Responsive Design

Le Header s'adapte automatiquement aux différentes tailles d'écran :

- **Desktop** : Affichage complet avec toutes les fonctionnalités
- **Tablet** : Masquage des statistiques détaillées
- **Mobile** : Interface simplifiée avec navigation essentielle

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Autres plateformes
Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- Railway
- AWS Amplify
- Docker

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation
2. Chercher dans les issues existantes
3. Créer une nouvelle issue avec les détails du problème

---

**Développé avec ❤️ pour la communauté Vinted** 