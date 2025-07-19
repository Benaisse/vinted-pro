// Types pour l'import Vinted

export interface VintedArticle {
  id: string;
  nom: string;
  prixUnitaire: number;
  categorie?: string;
  quantite?: number;
}

export interface VintedCommand {
  id: string;
  numeroCommande: string;
  dateCommande: Date;
  dateMiseAJour?: Date;
  statut: string;
  vendeur: string;
  acheteur: string;
  montantTotal: number;
  porteMonnaieVinted: number;
  articles: VintedArticle[];
  commissionVinted?: number;
  beneficeNet?: number;
} 