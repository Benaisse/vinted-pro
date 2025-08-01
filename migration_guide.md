# Guide de Migration Supabase pour Vinted Pro

## 🚀 Étape 1: Configuration Supabase

### 1.1 Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anon

### 1.2 Configurer les variables d'environnement
Ajoutez ces variables dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 1.3 Exécuter le script SQL
1. Allez dans l'éditeur SQL de Supabase
2. Copiez et exécutez le contenu du fichier `supabase_schema.sql`

## 🗄️ Étape 2: Migration des données

### 2.1 Données de test (optionnel)
Si vous voulez insérer des données de test, remplacez `'your-user-id-here'` par votre UUID utilisateur dans le script SQL.

### 2.2 Migration des données existantes
Créez un script de migration pour vos données existantes :

```typescript
// scripts/migrate-data.ts
import { supabase } from '@/lib/supabaseClient';

export async function migrateInventaireData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('Utilisateur non connecté');
    return;
  }

  // Données existantes de votre fichier inventaire.ts
  const inventaireData = [
    {
      nom: "Robe Zara fleurie",
      categorie: "Vêtements",
      prix: 25,
      cout: 5,
      statut: "En vente",
      vues: 156,
      likes: 23,
      dateAjout: "2024-01-10",
      image: "",
      etat: "Très bon état"
    },
    // ... autres articles
  ];

  for (const article of inventaireData) {
    const { error } = await supabase
      .from('inventaire')
      .insert({
        ...article,
        user_id: user.id,
        dateAjout: new Date(article.dateAjout).toISOString().split('T')[0]
      });

    if (error) {
      console.error('Erreur lors de la migration:', error);
    }
  }

  console.log('Migration terminée !');
}
```

## 🔧 Étape 3: Mise à jour du code

### 3.1 Vérifier la configuration Supabase
Votre fichier `supabaseClient.ts` est déjà configuré correctement.

### 3.2 Mettre à jour les types TypeScript
Créez un fichier de types pour Supabase :

```typescript
// types/supabase.ts
export interface Database {
  public: {
    Tables: {
      inventaire: {
        Row: {
          id: number;
          user_id: string;
          nom: string;
          categorie: string;
          description?: string;
          etat: string;
          marque?: string;
          taille?: string;
          prix: number;
          cout: number;
          marge: number;
          margePourcent: number;
          statut: string;
          vues: number;
          likes: number;
          dateAjout: string;
          image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inventaire']['Row'], 'id' | 'marge' | 'margePourcent' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['inventaire']['Insert']>;
      };
      ventes: {
        Row: {
          id: number;
          user_id: string;
          article_id?: number;
          article: string;
          categorie: string;
          acheteur: string;
          prix: number;
          cout: number;
          marge: number;
          margePourcent: number;
          date: string;
          statut: string;
          frais_port: number;
          frais_commission: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ventes']['Row'], 'id' | 'marge' | 'margePourcent' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ventes']['Insert']>;
      };
      stock: {
        Row: {
          id: number;
          user_id: string;
          nom: string;
          categorie: string;
          quantite: number;
          seuilAlerte: number;
          prixUnitaire: number;
          valeurTotale: number;
          statut: string;
          derniereMiseAJour: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stock']['Row'], 'id' | 'valeurTotale' | 'statut' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['stock']['Insert']>;
      };
    };
  };
}
```

## 🧪 Étape 4: Tests

### 4.1 Tester la connexion
```typescript
// Test de connexion
const { data, error } = await supabase
  .from('inventaire')
  .select('*')
  .limit(1);

if (error) {
  console.error('Erreur de connexion:', error);
} else {
  console.log('Connexion réussie !');
}
```

### 4.2 Tester les opérations CRUD
```typescript
// Test d'insertion
const { data: newArticle, error: insertError } = await supabase
  .from('inventaire')
  .insert({
    user_id: user.id,
    nom: 'Test Article',
    categorie: 'Vêtements',
    etat: 'Très bon état',
    prix: 50,
    cout: 10,
    statut: 'En vente'
  })
  .select();

// Test de mise à jour
const { error: updateError } = await supabase
  .from('inventaire')
  .update({ prix: 55 })
  .eq('id', newArticle[0].id);

// Test de suppression
const { error: deleteError } = await supabase
  .from('inventaire')
  .delete()
  .eq('id', newArticle[0].id);
```

## 🔒 Étape 5: Sécurité

### 5.1 Vérifier les politiques RLS
Assurez-vous que les politiques RLS sont activées et fonctionnent correctement :

```sql
-- Vérifier les politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 5.2 Tester l'isolation des données
Connectez-vous avec deux comptes différents et vérifiez que chaque utilisateur ne voit que ses propres données.

## 🚀 Étape 6: Déploiement

### 6.1 Variables d'environnement de production
Configurez les variables d'environnement sur votre plateforme de déploiement (Vercel, Netlify, etc.)

### 6.2 Migration des données de production
Si vous avez des données en production, créez un script de migration sécurisé.

## 📊 Étape 7: Monitoring

### 7.1 Surveiller les performances
Utilisez le dashboard Supabase pour surveiller :
- Les requêtes lentes
- L'utilisation de la base de données
- Les erreurs

### 7.2 Logs et debugging
Activez les logs détaillés dans Supabase pour le debugging.

## 🔧 Dépannage

### Problèmes courants :

1. **Erreur d'authentification**
   - Vérifiez les variables d'environnement
   - Assurez-vous que l'utilisateur est connecté

2. **Erreur de permissions**
   - Vérifiez les politiques RLS
   - Assurez-vous que l'utilisateur a les bonnes permissions

3. **Erreur de connexion**
   - Vérifiez l'URL et la clé Supabase
   - Vérifiez la connectivité réseau

4. **Données manquantes**
   - Vérifiez que les données ont été migrées correctement
   - Vérifiez les filtres dans vos requêtes

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console Supabase
2. Consultez la documentation Supabase
3. Vérifiez les erreurs dans la console du navigateur 