// Test de la détection des catégories
const testArticles = [
  "Robe Zara fleurie",
  "Sneakers Nike Air Max", 
  "Sac à main cuir",
  "Casquette New Era",
  "Pantalon Levi's",
  "Veste en cuir",
  "T-shirt basique",
  "Pull en laine",
  "Jean slim",
  "Chemise blanche"
];

// Simulation de la fonction extractCategoryFromName
function extractCategoryFromName(nom) {
  const nomLower = nom.toLowerCase();
  
  // Détection des chaussures
  if (nomLower.includes('chaussure') || nomLower.includes('sneaker') || nomLower.includes('basket') || 
      nomLower.includes('talon') || nomLower.includes('escarpin') || nomLower.includes('mocassin') ||
      nomLower.includes('rangers') || nomLower.includes('boots') || nomLower.includes('sandale')) {
    return 'Chaussures';
  }
  
  // Détection des sacs
  if (nomLower.includes('sac') || nomLower.includes('bag') || nomLower.includes('tote') || 
      nomLower.includes('pochette') || nomLower.includes('clutch') || nomLower.includes('backpack')) {
    return 'Sacs';
  }
  
  // Détection des accessoires
  if (nomLower.includes('casquette') || nomLower.includes('chapeau') || nomLower.includes('cap') ||
      nomLower.includes('bijou') || nomLower.includes('collier') || nomLower.includes('bracelet') ||
      nomLower.includes('montre') || nomLower.includes('ceinture') || nomLower.includes('écharpe') ||
      nomLower.includes('gant') || nomLower.includes('chaussette') || nomLower.includes('sous-vêtement')) {
    return 'Accessoires';
  }
  
  // Détection des vêtements (par défaut)
  if (nomLower.includes('robe') || nomLower.includes('pantalon') || nomLower.includes('jean') ||
      nomLower.includes('t-shirt') || nomLower.includes('pull') || nomLower.includes('sweat') ||
      nomLower.includes('veste') || nomLower.includes('manteau') || nomLower.includes('blazer') ||
      nomLower.includes('chemise') || nomLower.includes('jupe') || nomLower.includes('short') ||
      nomLower.includes('combinaison') || nomLower.includes('top') || nomLower.includes('cardigan')) {
    return 'Vêtements';
  }
  
  // Par défaut, on met Vêtements si on ne trouve rien de spécifique
  return 'Vêtements';
}

console.log("=== TEST DÉTECTION CATÉGORIES ===");
testArticles.forEach(article => {
  const categorie = extractCategoryFromName(article);
  console.log(`${article} → ${categorie}`);
}); 