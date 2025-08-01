import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
import { inventaire as inventaireData } from '@/data/inventaire';
import { stock as stockData } from '@/data/stock';
import { ventes as ventesData } from '@/data/ventes';

export async function migrateInventaireData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  console.log('🚀 Début de la migration de l\'inventaire...');

  let successCount = 0;
  let errorCount = 0;

  for (const article of inventaireData) {
    try {
      const { error } = await supabase
        .from('inventaire')
        .insert({
          user_id: user.id,
          nom: article.nom,
          categorie: article.categorie,
          etat: article.etat,
          prix: article.prix,
          cout: article.cout,
          statut: article.statut,
          vues: article.vues,
          likes: article.likes,
          dateAjout: new Date(article.dateAjout).toISOString().split('T')[0],
          image: article.image || null
        });

      if (error) {
        console.error(`❌ Erreur pour l'article "${article.nom}":`, error);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour l'article "${article.nom}":`, err);
      errorCount++;
    }
  }

  console.log(`✅ Migration inventaire terminée: ${successCount} succès, ${errorCount} erreurs`);
}

export async function migrateStockData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  console.log('🚀 Début de la migration du stock...');

  let successCount = 0;
  let errorCount = 0;

  for (const item of stockData) {
    try {
      const { error } = await supabase
        .from('stock')
        .insert({
          user_id: user.id,
          nom: item.nom,
          categorie: item.categorie,
          quantite: item.quantite,
          seuilAlerte: item.seuilAlerte,
          prixUnitaire: item.prixUnitaire
        });

      if (error) {
        console.error(`❌ Erreur pour l'article de stock "${item.nom}":`, error);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour l'article de stock "${item.nom}":`, err);
      errorCount++;
    }
  }

  console.log(`✅ Migration stock terminée: ${successCount} succès, ${errorCount} erreurs`);
}

export async function migrateVentesData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  console.log('🚀 Début de la migration des ventes...');

  let successCount = 0;
  let errorCount = 0;

  for (const vente of ventesData) {
    try {
      const { error } = await supabase
        .from('ventes')
        .insert({
          user_id: user.id,
          article: vente.article,
          categorie: vente.categorie,
          acheteur: vente.acheteur,
          prix: vente.prix,
          cout: vente.cout,
          date: new Date(vente.date).toISOString().split('T')[0],
          statut: vente.statut
        });

      if (error) {
        console.error(`❌ Erreur pour la vente "${vente.article}":`, error);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour la vente "${vente.article}":`, err);
      errorCount++;
    }
  }

  console.log(`✅ Migration ventes terminée: ${successCount} succès, ${errorCount} erreurs`);
}

export async function migrateAllData() {
  console.log('🔄 Début de la migration complète...');
  
  try {
    await migrateInventaireData();
    await migrateStockData();
    await migrateVentesData();
    
    console.log('🎉 Migration complète terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration complète:', error);
  }
}

// Fonction pour nettoyer les données existantes (à utiliser avec précaution)
export async function clearAllData() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  console.log('⚠️  Suppression de toutes les données...');

  try {
    const { error: ventesError } = await supabase
      .from('ventes')
      .delete()
      .eq('user_id', user.id);

    const { error: stockError } = await supabase
      .from('stock')
      .delete()
      .eq('user_id', user.id);

    const { error: inventaireError } = await supabase
      .from('inventaire')
      .delete()
      .eq('user_id', user.id);

    if (ventesError || stockError || inventaireError) {
      console.error('❌ Erreurs lors de la suppression:', { ventesError, stockError, inventaireError });
    } else {
      console.log('✅ Toutes les données ont été supprimées');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
  }
}

// Fonction pour vérifier la connexion
export async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('inventaire')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    } else {
      console.log('✅ Connexion réussie !');
      return true;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return false;
  }
}

// Fonction pour afficher les statistiques
export async function showStats() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('❌ Utilisateur non connecté');
    return;
  }

  try {
    const { data: inventaireCount } = await supabase
      .from('inventaire')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    const { data: stockCount } = await supabase
      .from('stock')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    const { data: ventesCount } = await supabase
      .from('ventes')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    console.log('📊 Statistiques de votre base de données:');
    console.log(`   - Inventaire: ${inventaireCount?.length || 0} articles`);
    console.log(`   - Stock: ${stockCount?.length || 0} articles`);
    console.log(`   - Ventes: ${ventesCount?.length || 0} ventes`);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
  }
} 