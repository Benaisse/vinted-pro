# Instructions pour nettoyer le cache et résoudre les erreurs

## 🧹 Étapes à suivre :

### 1. **Exécuter le script de nettoyage Supabase**
- Copiez le contenu du fichier `fix_column_names.sql`
- Collez-le dans votre SQL Editor Supabase
- Exécutez le script complet

### 2. **Nettoyer le cache du navigateur**
- Ouvrez les **Outils de développement** (F12)
- Clic droit sur le bouton **Actualiser** (🔄)
- Sélectionnez **"Vider le cache et actualiser"** (ou Ctrl+Shift+R)

### 3. **Nettoyer le localStorage**
Dans la console du navigateur, exécutez :
```javascript
localStorage.clear();
```

### 4. **Redémarrer l'application**
```bash
npm run dev
```

### 5. **Tester l'import**
- Reconnectez-vous à votre application
- Essayez d'importer votre fichier Vinted
- Vérifiez que les erreurs 400 ont disparu

## ✅ Résultat attendu :
- Plus d'erreurs `date ajout` ou `user id`
- Les requêtes utilisent `date_ajout` et `user_id`
- L'import fonctionne correctement

## 🔍 Vérification :
Dans la console du navigateur, vous devriez voir :
- ✅ Requêtes POST réussies (200)
- ✅ Messages "Article ajouté avec succès"
- ❌ Plus d'erreurs 400 Bad Request 