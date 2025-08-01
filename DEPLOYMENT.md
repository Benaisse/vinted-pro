# 🚀 GUIDE DE DÉPLOIEMENT - VINTED PRO

## 📋 PRÉREQUIS

### **Environnement de développement :**
- Node.js 18+ 
- npm ou yarn
- Git

### **Services externes :**
- Compte Supabase (gratuit)
- Compte Vercel (optionnel, pour le déploiement)

---

## 🔧 CONFIGURATION LOCALE

### **1. Cloner/restaurer le projet :**
```bash
# Si vous avez une sauvegarde
cd vinted-pro-backup-YYYYMMDD-HHMMSS
./restore.sh

# Ou cloner depuis Git
git clone <votre-repo>
cd vinted-pro
```

### **2. Installer les dépendances :**
```bash
npm install
```

### **3. Configuration Supabase :**

#### **A. Créer un projet Supabase :**
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé anon

#### **B. Configurer les variables d'environnement :**
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

#### **C. Exécuter le script SQL :**
1. Aller dans l'éditeur SQL de Supabase
2. Copier le contenu de `fix_column_names.sql`
3. Exécuter le script complet

### **4. Démarrer l'application :**
```bash
npm run dev
```

---

## 🌐 DÉPLOIEMENT PRODUCTION

### **Option 1 : Vercel (Recommandé)**

#### **A. Préparer le projet :**
```bash
# Build de test
npm run build

# Vérifier que tout fonctionne
npm start
```

#### **B. Déployer sur Vercel :**
1. Installer Vercel CLI : `npm i -g vercel`
2. Se connecter : `vercel login`
3. Déployer : `vercel --prod`

#### **C. Configurer les variables d'environnement :**
Dans le dashboard Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **Option 2 : Netlify**

#### **A. Préparer le projet :**
```bash
# Build
npm run build

# Dossier de sortie : .next
```

#### **B. Déployer :**
1. Connecter le repo Git à Netlify
2. Configurer les variables d'environnement
3. Déployer automatiquement

### **Option 3 : Serveur VPS**

#### **A. Préparer le serveur :**
```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2
npm install -g pm2
```

#### **B. Déployer :**
```bash
# Cloner le projet
git clone <votre-repo>
cd vinted-pro

# Installer les dépendances
npm install

# Build
npm run build

# Démarrer avec PM2
pm2 start npm --name "vinted-pro" -- start
pm2 save
pm2 startup
```

---

## 🔒 SÉCURITÉ

### **Variables d'environnement :**
- ✅ Ne jamais commiter `.env.local`
- ✅ Utiliser des clés différentes pour dev/prod
- ✅ Roter régulièrement les clés Supabase

### **Supabase :**
- ✅ Activer RLS (Row Level Security)
- ✅ Configurer les politiques d'accès
- ✅ Surveiller les logs d'accès

### **Application :**
- ✅ Validation des données côté client ET serveur
- ✅ Protection CSRF
- ✅ Headers de sécurité

---

## 📊 MONITORING

### **Vercel Analytics :**
```bash
# Installer
npm install @vercel/analytics

# Utiliser dans _app.tsx
import { Analytics } from '@vercel/analytics/react'
```

### **Supabase Monitoring :**
- Dashboard Supabase pour les requêtes
- Logs d'authentification
- Métriques de performance

### **Application Monitoring :**
```javascript
// Ajouter dans les composants critiques
console.log('Performance:', performance.now())
```

---

## 🔄 MAINTENANCE

### **Mises à jour régulières :**
```bash
# Vérifier les vulnérabilités
npm audit

# Mettre à jour les dépendances
npm update

# Mettre à jour Next.js
npm install next@latest
```

### **Sauvegarde de la base de données :**
```bash
# Export Supabase
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### **Monitoring des performances :**
- Lighthouse CI
- Bundle analyzer
- Core Web Vitals

---

## 🚨 DÉPANNAGE

### **Erreurs courantes :**

#### **1. Erreur de connexion Supabase :**
```bash
# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### **2. Erreur de build :**
```bash
# Nettoyer le cache
rm -rf .next
npm run build
```

#### **3. Erreur de déploiement :**
```bash
# Vérifier les logs
vercel logs
netlify logs
```

### **Logs utiles :**
```bash
# Logs de développement
npm run dev

# Logs de production
npm start

# Logs PM2
pm2 logs vinted-pro
```

---

## 📈 OPTIMISATION

### **Performance :**
- ✅ Lazy loading des composants
- ✅ Optimisation des images
- ✅ Code splitting
- ✅ Cache intelligent

### **SEO :**
- ✅ Meta tags dynamiques
- ✅ Sitemap automatique
- ✅ Open Graph
- ✅ Schema.org

### **Accessibilité :**
- ✅ ARIA labels
- ✅ Navigation clavier
- ✅ Contraste des couleurs
- ✅ Screen readers

---

## 🎯 CHECKLIST DE DÉPLOIEMENT

### **Pré-déploiement :**
- [ ] Tests locaux OK
- [ ] Build sans erreurs
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Documentation mise à jour

### **Post-déploiement :**
- [ ] Application accessible
- [ ] Authentification fonctionnelle
- [ ] Import Vinted opérationnel
- [ ] Dashboard affiché correctement
- [ ] Analytics configurées
- [ ] Monitoring actif

---

## 📞 SUPPORT

### **En cas de problème :**
1. Vérifier les logs d'erreur
2. Consulter la documentation Supabase
3. Vérifier les variables d'environnement
4. Tester en local d'abord

### **Ressources utiles :**
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

---

**🎉 VOTRE APPLICATION VINTED PRO EST PRÊTE POUR LA PRODUCTION !** 