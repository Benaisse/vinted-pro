import Papa from "papaparse";
import { VintedCommand, VintedArticle } from "@/types/vinted";

// Utilitaires de parsing (extraits de ImportVintedCSVButton)
function extractPrix(text: string): number {
  const match = text.match(/([0-9]+[\.,]?[0-9]*)\s*(€|e)?/i);
  if (match && match[1]) {
    return parseFloat(match[1].replace(',', '.').replace(/[^0-9.]/g, ''));
  }
  return 0;
}

function extractDate(text: string): Date {
  // Formats courants : 01/05/2024, 2024-05-01, 1 mai 2024, 1er mai 2024, etc.
  const regexes = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/, // 01/05/2024 ou 01-05-2024
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,   // 2024-05-01
    /\b(\d{1,2}(er)? [a-zA-Zéûî]+ \d{4})\b/,       // 1 mai 2024, 1er mai 2024
  ];
  for (const regex of regexes) {
    const match = text.match(regex);
    if (match && match[1]) return new Date(match[1]);
  }
  return new Date();
}

function parseCSV(text: string): VintedCommand[] {
  const result = Papa.parse(text, { header: true });
  const rows = result.data as any[];
  return rows.filter(row => row["N° Commande"] || row["Numéro"] || row["numeroCommande"]).map((row, idx) => {
    const articles: VintedArticle[] = [];
    // Si les articles sont listés dans une colonne, à adapter ici
    // Sinon, on crée un article unique par commande
    articles.push({
      id: `${row["N° Commande"] || row["Numéro"] || row["numeroCommande"]}-1`,
      nom: row["Nom de l'article"] || row["Article"] || row["Nom"] || "",
      prixUnitaire: parseFloat(row["Prix"] || row["Montant"] || row["Prix de vente"] || "0"),
      categorie: row["Catégorie"] || undefined,
      quantite: row["Quantité"] ? parseInt(row["Quantité"]) : undefined,
    });
    return {
      id: row["N° Commande"] || row["Numéro"] || row["numeroCommande"] || `cmd-${idx}`,
      numeroCommande: row["N° Commande"] || row["Numéro"] || row["numeroCommande"] || `cmd-${idx}`,
      dateCommande: row["Date"] ? new Date(row["Date"]) : new Date(),
      statut: row["Statut"] || "",
      vendeur: row["Vendeur"] || "",
      acheteur: row["Acheteur"] || row["Acheteuse"] || row["Acheteur/Acheteuse"] || "",
      montantTotal: parseFloat(row["Montant total"] || row["Montant"] || row["Prix de vente"] || "0"),
      porteMonnaieVinted: parseFloat(row["Porte-monnaie Vinted"] || "0"),
      articles,
      commissionVinted: row["Commission Vinted"] ? parseFloat(row["Commission Vinted"]) : undefined,
      beneficeNet: row["Bénéfice net"] ? parseFloat(row["Bénéfice net"]) : undefined,
    };
  });
}

function parseHTML(text: string): VintedCommand[] {
  // Extraction par blocs Commande
  const blocks = text.split(/Commande:/).slice(1); // ignore le premier split vide
  const commandes: VintedCommand[] = [];
  blocks.forEach((block: string, idx: number) => {
    const numeroCommande = block.match(/(\d{6,})/)?.[1] || `cmd-${idx}`;
    const dateCommande = extractDate(block);
    const acheteur = block.match(/Acheteur:\s*([a-zA-Z0-9_\-]+)/)?.[1] || "";
    const statut = block.match(/Statut:\s*([a-zA-Z]+)/)?.[1] || "";
    const montantTotal = extractPrix(block.match(/Total:\s*([0-9,.]+) ?€/i)?.[0] || "");
    const articlesSection = block.split('Articles:')[1] || '';
    const lines = articlesSection.split(/\n|<br\s*\/?>|•/).map((l: string) => l.trim()).filter((l: string) => l);
    const articles: VintedArticle[] = lines.map((line: string, i: number) => {
      const prixMatch = line.match(/([0-9]+[\.,]?[0-9]*)\s*(EUR|€)/i);
      const prixUnitaire = prixMatch ? parseFloat(prixMatch[1].replace(',', '.')) : 0;
      const nom = prixMatch ? line.slice(0, prixMatch.index).replace(/[-:•]$/, '').trim() : line.trim();
      return {
        id: `${numeroCommande}-${i+1}`,
        nom,
        prixUnitaire,
      };
    }).filter((a: VintedArticle) => a.nom && a.prixUnitaire > 0);
    commandes.push({
      id: numeroCommande,
      numeroCommande,
      dateCommande,
      statut,
      vendeur: "",
      acheteur,
      montantTotal,
      porteMonnaieVinted: 0,
      articles,
    });
  });
  return commandes;
}

export function parseVintedData(text: string): VintedCommand[] {
  // Détection du format
  if (text.includes('<html') || text.includes('Articles:')) {
    return parseHTML(text);
  }
  if (text.includes(';') || text.includes(',') || text.includes('N° Commande')) {
    return parseCSV(text);
  }
  // Fallback: retourne un tableau vide
  return [];
} 