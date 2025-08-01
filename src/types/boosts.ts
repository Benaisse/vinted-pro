// Types pour les boosts Vinted
export interface Boost {
  id: number;
  user_id: string;
  date_commande: string;
  montant_regle: number;
  porte_monnaie_vinted: number;
  duree_jours: number;
  identifiant_article: number;
  created_at?: string;
  updated_at?: string;
}

export interface BoostFormData {
  date_commande: string;
  montant_regle: number;
  porte_monnaie_vinted: number;
  duree_jours: number;
  identifiant_article: number;
}

// Statistiques des boosts
export interface BoostStats {
  total_boosts: number;
  total_depense: number;
  moyenne_par_boost: number;
  total_duree: number;
  boosts_ce_mois: number;
  depense_ce_mois: number;
} 