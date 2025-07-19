import { useData } from "@/contexts/DataContext";
import { VintedCommand, VintedArticle } from "@/types/vinted";
import { v4 as uuidv4 } from "uuid";

export function useVintedImport() {
  const { addArticle, addVente, articles, ventes } = useData();

  // Convertir une commande Vinted en articles et vente
  const convertVintedCommand = (commande: VintedCommand) => {
    const newArticles: any[] = [];
    const newVente: any = {
      id: uuidv4(),
      date: commande.dateCommande,
      acheteur: commande.acheteur,
      montant: commande.montantTotal,
      commission: commande.commissionVinted || commande.montantTotal * 0.1,
      benefice: commande.beneficeNet || commande.montantTotal * 0.9,
      statut: commande.statut,
      numeroCommande: commande.numeroCommande,
      articles: []
    };

    // Convertir chaque article de la commande
    commande.articles.forEach((article: VintedArticle) => {
      const newArticle = {
        id: uuidv4(),
        nom: article.nom,
        prix: article.prixUnitaire,
        categorie: article.categorie || "Autre",
        quantite: article.quantite || 1,
        statut: "Vendu",
        dateAjout: new Date(),
        dateVente: commande.dateCommande,
        acheteur: commande.acheteur,
        numeroCommande: commande.numeroCommande
      };

      newArticles.push(newArticle);
      newVente.articles.push({
        id: newArticle.id,
        nom: newArticle.nom,
        prix: newArticle.prix,
        quantite: newArticle.quantite
      });
    });

    return { newArticles, newVente };
  };

  // Importer des commandes Vinted
  const importVintedData = async (commandes: VintedCommand[]) => {
    try {
      const allNewArticles: any[] = [];
      const allNewVentes: any[] = [];

      // Convertir chaque commande
      commandes.forEach(commande => {
        const { newArticles, newVente } = convertVintedCommand(commande);
        allNewArticles.push(...newArticles);
        allNewVentes.push(newVente);
      });

      // Ajouter les articles
      allNewArticles.forEach(article => {
        addArticle(article);
      });

      // Ajouter les ventes
      allNewVentes.forEach(vente => {
        addVente(vente);
      });

      // Les statistiques se mettent à jour automatiquement via le contexte

      return {
        success: true,
        articlesAdded: allNewArticles.length,
        ventesAdded: allNewVentes.length,
        totalMontant: allNewVentes.reduce((sum, v) => sum + v.montant, 0)
      };
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      };
    }
  };

  // Vérifier les doublons (basé sur la date et l'acheteur)
  const checkDuplicates = (commandes: VintedCommand[]) => {
    const duplicates = commandes.filter(cmd => 
      ventes.some(v => 
        v.acheteur === cmd.acheteur && 
        new Date(v.date).toDateString() === cmd.dateCommande.toDateString()
      )
    );
    
    return {
      hasDuplicates: duplicates.length > 0,
      duplicates: duplicates,
      count: duplicates.length
    };
  };

  // Calculer les statistiques d'import
  const calculateImportStats = (commandes: VintedCommand[]) => {
    const totalArticles = commandes.reduce((sum, cmd) => 
      sum + cmd.articles.length, 0
    );
    const totalMontant = commandes.reduce((sum, cmd) => 
      sum + cmd.montantTotal, 0
    );
    const totalCommission = commandes.reduce((sum, cmd) => 
      sum + (cmd.commissionVinted || cmd.montantTotal * 0.1), 0
    );
    const totalBenefice = commandes.reduce((sum, cmd) => 
      sum + (cmd.beneficeNet || cmd.montantTotal * 0.9), 0
    );

    return {
      commandesCount: commandes.length,
      articlesCount: totalArticles,
      totalMontant,
      totalCommission,
      totalBenefice,
      moyenneParCommande: totalMontant / commandes.length
    };
  };

  return {
    importVintedData,
    checkDuplicates,
    calculateImportStats,
    convertVintedCommand
  };
} 