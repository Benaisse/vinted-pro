export const ventes = [
  {
    id: 1,
    article: "Robe Zara fleurie",
    categorie: "Vêtements",
    acheteur: "Marie L.",
    prix: 25,
    cout: 5,
    marge: 20,
    margePourcent: 80,
    date: "15/01/2024",
    statut: "Livré"
  },
  {
    id: 2,
    article: "Sneakers Nike Air Max",
    categorie: "Chaussures",
    acheteur: "Thomas M.",
    prix: 65,
    cout: 15,
    marge: 50,
    margePourcent: 77,
    date: "14/01/2024",
    statut: "Expédié"
  },
  {
    id: 3,
    article: "Sac Louis Vuitton",
    categorie: "Sacs",
    acheteur: "Sophie R.",
    prix: 120,
    cout: 30,
    marge: 90,
    margePourcent: 75,
    date: "13/01/2024",
    statut: "En cours"
  },
  {
    id: 4,
    article: "Jean Levi's 501",
    categorie: "Vêtements",
    acheteur: "Pierre D.",
    prix: 40,
    cout: 10,
    marge: 30,
    margePourcent: 75,
    date: "12/01/2024",
    statut: "Livré"
  },
  {
    id: 5,
    article: "Montre Daniel Wellington",
    categorie: "Accessoires",
    acheteur: "Emma F.",
    prix: 85,
    cout: 20,
    marge: 65,
    margePourcent: 76,
    date: "11/01/2024",
    statut: "Expédié"
  },
  {
    id: 6,
    article: "Blazer H&M",
    categorie: "Vêtements",
    acheteur: "Lucas G.",
    prix: 35,
    cout: 8,
    marge: 27,
    margePourcent: 77,
    date: "10/01/2024",
    statut: "Livré"
  },
  // Ajout de 336 ventes supplémentaires pour atteindre 342
  ...Array.from({ length: 336 }, (_, i) => ({
    id: i + 7,
    article: `Article ${i + 7}`,
    categorie: ["Vêtements", "Chaussures", "Sacs", "Accessoires"][Math.floor(Math.random() * 4)],
    acheteur: `Client ${i + 7}`,
    prix: Math.floor(Math.random() * 100) + 20,
    cout: Math.floor(Math.random() * 20) + 5,
    marge: 0, // Sera calculé
    margePourcent: 0, // Sera calculé
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    statut: ["Livré", "Expédié", "En cours"][Math.floor(Math.random() * 3)]
  })).map(vente => ({
    ...vente,
    marge: vente.prix - vente.cout,
    margePourcent: Math.round(((vente.prix - vente.cout) / vente.prix) * 100)
  }))
]; 