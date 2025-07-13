export const inventaire = [
  {
    id: 1,
    nom: "Robe Zara fleurie",
    categorie: "Vêtements",
    prix: 25,
    cout: 5,
    marge: 20,
    margePourcent: 80,
    statut: "En vente" as const,
    vues: 156,
    likes: 23,
    dateAjout: "10/01/2024",
    image: "",
    etat: "Très bon état"
  },
  {
    id: 2,
    nom: "Sneakers Nike Air Max",
    categorie: "Chaussures",
    prix: 65,
    cout: 15,
    marge: 50,
    margePourcent: 77,
    statut: "En vente" as const,
    vues: 89,
    likes: 12,
    dateAjout: "09/01/2024",
    image: "",
    etat: "Très bon état"
  },
  {
    id: 3,
    nom: "Sac Louis Vuitton",
    categorie: "Sacs",
    prix: 120,
    cout: 30,
    marge: 90,
    margePourcent: 75,
    statut: "Vendu" as const,
    vues: 234,
    likes: 45,
    dateAjout: "08/01/2024",
    image: "",
    etat: "Très bon état"
  },
  {
    id: 4,
    nom: "Jean Levi's 501",
    categorie: "Vêtements",
    prix: 40,
    cout: 10,
    marge: 30,
    margePourcent: 75,
    statut: "Archivé" as const,
    vues: 67,
    likes: 5,
    dateAjout: "07/01/2024",
    image: "",
    etat: "Très bon état"
  },
  // Ajout de 46 articles supplémentaires pour atteindre 50
  ...Array.from({ length: 46 }, (_, i) => {
    const statuts = ["En vente", "Vendu", "Archivé"] as const;
    const statut = statuts[Math.floor(Math.random() * 3)];
    
    return {
      id: i + 5,
      nom: `Article ${i + 5}`,
      categorie: ["Vêtements", "Chaussures", "Sacs", "Accessoires"][Math.floor(Math.random() * 4)],
      prix: Math.floor(Math.random() * 100) + 20,
      cout: Math.floor(Math.random() * 20) + 5,
      marge: 0, // Sera calculé
      margePourcent: 0, // Sera calculé
      statut,
      vues: Math.floor(Math.random() * 300) + 10,
      likes: Math.floor(Math.random() * 50) + 1,
      dateAjout: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      image: "",
      etat: "Très bon état"
    };
  }).map(article => ({
    ...article,
    marge: article.prix - article.cout,
    margePourcent: Math.round(((article.prix - article.cout) / article.prix) * 100)
  }))
]; 