import { detectFileFormat, SupportedFormat } from './UniversalFormatDetector';
import Papa from 'papaparse';

export interface VintedArticle {
  nom: string;
  acheteur?: string;
  prix: number;
  date?: string;
  categorie?: string;
  [key: string]: any;
}

export class VintedUniversalParser {
  static parse(content: string, filename?: string): VintedArticle[] {
    const format = detectFileFormat(content, filename);
    switch (format) {
      case 'html': 
        return this.parseHTML(content);
      case 'csv': return this.parseCSV(content);
      case 'txt': return this.parseTXT(content);
      case 'json': return this.parseJSON(content);
      case 'xml': return this.parseXML(content);
      default: return this.parseUnknown(content);
    }
  }
  // --- CSV ---
  private static parseCSV(content: string): VintedArticle[] {
    const { data } = Papa.parse(content, { header: true, skipEmptyLines: true });
    return (data as any[]).map(row => {
      const nom = row["Nom de l'article"] || row["Article"] || row["Nom"] || "";
      return {
        nom,
        acheteur: row["Acheteur"] || row["Acheteuse"] || row["Acheteur/Acheteuse"] || "",
        prix: parseFloat(row["Prix"] || row["Montant"] || row["Prix de vente"] || "0"),
        date: row["Date"] || row["date"] || '',
        categorie: row["Catégorie"] || row["Category"] || this.extractCategoryFromName(nom),
        ...row
      };
    }).filter(a => a.nom && a.prix);
  }
  // --- HTML ---
  private static parseHTML(content: string): VintedArticle[] {
    // Remplacer les <br>, <br/>, <br /> par des retours à la ligne
    let cleanContent = content.replace(/<br\s*\/?>/gi, '\n');
    // Supprimer toutes les autres balises HTML
    cleanContent = cleanContent.replace(/<[^>]+>/g, '');
    // Découper sur chaque bloc de commande
    const blocks = cleanContent.split(/Commandé:/).slice(1);
    const articles: VintedArticle[] = [];
    for (const block of blocks) {
      // Date de la commande (juste après 'Commandé:')
      const dateMatch = block.match(/\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
      const date = dateMatch ? dateMatch[1].split(' ')[0] : '';
      // Extraction du nom de l'acheteur
      const acheteurMatch = block.match(/Acheteur\s*:\s*(.+)/i);
      const acheteur = acheteurMatch ? acheteurMatch[1].trim() : '';
      // Section des articles
      let articlesSection = '';
      if (block.includes('Articles:')) {
        articlesSection = block.split('Articles:')[1];
      } else {
        // fallback: lignes commençant par '•'
        const bulletLines = block.split('\n').filter(l => l.trim().startsWith('•'));
        articlesSection = bulletLines.join('\n');
      }
      // On extrait chaque ligne d'article
      const lines = articlesSection.split(/\n|•/).map(l => l.trim()).filter(l => l);
      
      // Traiter les lignes par paires (nom + prix)
      for (let i = 0; i < lines.length; i += 2) {
        const nomLine = lines[i];
        const prixLine = lines[i + 1];
        
        if (nomLine && prixLine) {
          // Cherche un prix dans la ligne de prix
          const prixMatch = prixLine.match(/([0-9]+[\.,]?[0-9]*)\s*(EUR|€)/i);
          const prix = prixMatch ? parseFloat(prixMatch[1].replace(',', '.')) : 0;
          
          // Le nom est la ligne de nom, nettoyé des caractères superflus
          const nom = nomLine.replace(/[-:•]$/, '').trim();
          
          // Extraire la catégorie depuis le nom de l'article
          const categorie = this.extractCategoryFromName(nom);
          
          if (nom && prix > 0) {
            articles.push({ 
              nom, 
              prix, 
              date, 
              acheteur,
              categorie 
            });
          }
        }
      }
    }
    return articles;
  }

  // Méthode pour extraire la catégorie depuis le nom de l'article
  public static extractCategoryFromName(nom: string): string {
    const nomLower = nom.toLowerCase();
    
    // Détection des chaussures
    if (nomLower.includes('chaussure') || nomLower.includes('sneaker') || nomLower.includes('basket') || 
        nomLower.includes('talon') || nomLower.includes('escarpin') || nomLower.includes('mocassin') ||
        nomLower.includes('rangers') || nomLower.includes('boots') || nomLower.includes('sandale') ||
        nomLower.includes('ballerine') || nomLower.includes('mule') || nomLower.includes('espadrille')) {
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
  // --- TXT ---
  private static parseTXT(content: string): VintedArticle[] {
    return this.parseHTML(content); // fallback sur le même parsing que HTML
  }
  // --- JSON ---
  private static parseJSON(content: string): VintedArticle[] {
    try {
      const data = JSON.parse(content);
      const items = Array.isArray(data) ? data : data.commands || data.orders || data.items || [data];
      return items.map((item: any) => {
        const nom = item.nom || item.name || '';
        return {
          nom,
          acheteur: item.acheteur || item.buyer || '',
          prix: item.prix || item.price || item.total || 0,
          date: item.date || '',
          categorie: item.categorie || item.category || this.extractCategoryFromName(nom),
          ...item
        };
      }).filter((a: any) => a.nom && a.prix);
    } catch (e) {
      return [];
    }
  }
  // --- XML ---
  private static parseXML(content: string): VintedArticle[] {
    const matches = content.match(/<(?:command|order|item)[^>]*>[\s\S]*?<\/(?:command|order|item)>/gi);
    if (!matches) return [];
    return matches.map(xmlBlock => {
      const nom = this.extractTag(xmlBlock, ['nom', 'name', 'article']);
      const acheteur = this.extractTag(xmlBlock, ['acheteur', 'buyer']);
      const prix = parseFloat(this.extractTag(xmlBlock, ['prix', 'price', 'total']) || '0');
      const date = this.extractTag(xmlBlock, ['date', 'timestamp']);
      const categorie = this.extractTag(xmlBlock, ['categorie', 'category']);
      return { nom, acheteur, prix, date, categorie };
    }).filter(a => a.nom && a.prix);
  }
  private static extractTag(xml: string, tags: string[]): string {
    for (const tag of tags) {
      const match = xml.match(new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'i'));
      if (match) return match[1].trim();
    }
    return '';
  }
  // --- Fallback ---
  private static parseUnknown(content: string): VintedArticle[] {
    return this.parseTXT(content);
  }
} 