export const stock = [
  {
    id: 1,
    nom: "Robe Zara fleurie",
    categorie: "Vêtements",
    quantite: 5,
    seuilAlerte: 3,
    prixUnitaire: 25,
    valeurTotale: 125,
    statut: "Normal" as const,
    derniereMiseAJour: "15/01/2024"
  },
  {
    id: 2,
    nom: "Sneakers Nike Air Max",
    categorie: "Chaussures",
    quantite: 2,
    seuilAlerte: 5,
    prixUnitaire: 65,
    valeurTotale: 130,
    statut: "Faible" as const,
    derniereMiseAJour: "14/01/2024"
  },
  {
    id: 3,
    nom: "Sac Louis Vuitton",
    categorie: "Sacs",
    quantite: 0,
    seuilAlerte: 2,
    prixUnitaire: 120,
    valeurTotale: 0,
    statut: "Rupture" as const,
    derniereMiseAJour: "13/01/2024"
  },
  {
    id: 4,
    nom: "Jean Levi's 501",
    categorie: "Vêtements",
    quantite: 8,
    seuilAlerte: 3,
    prixUnitaire: 40,
    valeurTotale: 320,
    statut: "Normal" as const,
    derniereMiseAJour: "12/01/2024"
  },
  {
    id: 5,
    nom: "Montre Daniel Wellington",
    categorie: "Accessoires",
    quantite: 3,
    seuilAlerte: 2,
    prixUnitaire: 85,
    valeurTotale: 255,
    statut: "Normal" as const,
    derniereMiseAJour: "11/01/2024"
  },
  // Ajout de 45 articles supplémentaires pour atteindre 50
  ...Array.from({ length: 45 }, (_, i) => {
    const quantite = Math.floor(Math.random() * 15) + 1;
    const prixUnitaire = Math.floor(Math.random() * 100) + 20;
    const seuilAlerte = Math.floor(Math.random() * 5) + 2;
    
    let statut: "Normal" | "Faible" | "Rupture" = "Normal";
    if (quantite === 0) statut = "Rupture";
    else if (quantite <= seuilAlerte) statut = "Faible";
    
    return {
      id: i + 6,
      nom: `Article ${i + 6}`,
      categorie: ["Vêtements", "Chaussures", "Sacs", "Accessoires"][Math.floor(Math.random() * 4)],
      quantite,
      seuilAlerte,
      prixUnitaire,
      valeurTotale: quantite * prixUnitaire,
      statut,
      derniereMiseAJour: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
    };
  })
]; 