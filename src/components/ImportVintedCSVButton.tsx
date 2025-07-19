"use client";
import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
// import { Article } from "@/components/ArticleFormModal"; // supprimé car conflit avec la déclaration locale
import type { ParseResult } from "papaparse";
import { Upload, Trash2, Edit2, Check, X } from "lucide-react";

interface Article {
  nom: string;
  acheteur?: string;
  prix: number;
  date: string;
  [key: string]: any;
}

export function ImportVintedSmartButton({ onImport }: { onImport: (articles: Article[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Article[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  // 1. Ajouter un état pour ouvrir/fermer la modal
  const [modalOpen, setModalOpen] = useState(false);

  // Détection et parsing intelligent
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    let allArticles: Article[] = [];
    for (const file of Array.from(files)) {
      const text = await file.text();
      if (file.name.endsWith('.csv')) {
        // CSV Vinted
        const result = Papa.parse(text, { header: true });
        const articles = (result.data as any[]).map(row => ({
          nom: row["Nom de l'article"] || row["Article"] || row["Nom"] || "",
          acheteur: row["Acheteur"] || row["Acheteuse"] || row["Acheteur/Acheteuse"] || "",
          prix: parseFloat(row["Prix"] || row["Montant"] || row["Prix de vente"] || "0"),
          date: extractDate(text), // Utiliser la nouvelle fonction pour extraire la date
          ...row
        })).filter(a => a.nom && a.prix);
        allArticles = allArticles.concat(articles);
      } else if (file.name.endsWith('.html')) {
        // HTML Vinted (extraction basique)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        // Recherche des blocs de commandes/articles (à adapter selon structure)
        const blocks = Array.from(doc.querySelectorAll('body *')).filter(el => el.textContent?.includes('Commandé') || el.textContent?.includes('Articles:'));
        for (const block of blocks) {
          const txt = block.textContent || "";
          // Extraction par regex (à affiner selon structure)
          const nomMatch = txt.match(/Article[s]?:\s*(.+?)(?:\n|$)/i);
          const acheteurMatch = txt.match(/Acheteur[s]?:\s*(.+?)(?:\n|$)/i);
          const prixMatch = txt.match(/Prix|Montant|Total:\s*([\d,.]+) ?€/i);
          const dateMatch = txt.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
          allArticles.push({
            nom: nomMatch?.[1]?.trim() || "",
            acheteur: acheteurMatch?.[1]?.trim() || "",
            prix: extractPrix(txt),
            date: dateMatch?.[1] || "",
            brut: txt
          });
        }
      }
    }
    setPreview(allArticles);
    if (allArticles.length === 0) toast.error("Aucun article détecté dans les fichiers importés.");
  };

  // Edition d'un article
  const handleEdit = (idx: number, field: string, value: string) => {
    setEditIndex(idx);
    setEditArticle({ ...preview[idx], [field]: value });
  };
  const handleEditSave = () => {
    if (editIndex === null || !editArticle) return;
    const updated = [...preview];
    updated[editIndex] = editArticle;
    setPreview(updated);
    setEditIndex(null);
    setEditArticle(null);
  };
  const handleEditCancel = () => {
    setEditIndex(null);
    setEditArticle(null);
  };
  // Suppression d'un article
  const handleDelete = (idx: number) => {
    setPreview(preview.filter((_, i) => i !== idx));
  };
  // Validation
  const handleValidate = () => {
    if (preview.length === 0) return toast.error("Aucun article à importer.");
    onImport(preview);
    setPreview([]);
    toast.success("Articles importés avec succès !");
    setModalOpen(false); // Fermer la modal après validation
  };

  return (
    <div>
      <Button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
        <Upload className="w-5 h-5 mr-2" /> Importer Vinted
      </Button>

      {/* Bandeau d'information moderne */}
      <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 flex items-center gap-3 shadow-sm">
        <Upload className="w-6 h-6 text-indigo-500" />
        <span className="text-indigo-800 font-semibold">Prévisualisez, modifiez ou supprimez vos articles avant de valider l'import dans l'application.</span>
      </div>

      {/* 3. Modal moderne (avec drag & drop, instructions, preview, édition inline) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative animate-fade-in">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setModalOpen(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-2 text-indigo-700">Importer vos données Vinted</h2>
            <p className="mb-4 text-slate-600">Glissez-déposez un ou plusieurs fichiers CSV/HTML ou cliquez pour sélectionner. Les prix et dates sont détectés automatiquement.</p>
            {/* Drag & drop + input file */}
            <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition" onClick={() => inputRef.current?.click()}>
              <Upload className="w-10 h-10 text-indigo-400 mb-2" />
              <span className="text-indigo-600 font-semibold">Déposez vos fichiers ici ou cliquez pour choisir</span>
              <input ref={inputRef} type="file" accept=".csv,.html,.htm" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
            </div>
            {/* Prévisualisation et édition inline */}
            {preview && preview.length > 0 && (
              <div className="overflow-x-auto max-h-96 mb-4">
                <table className="min-w-full text-sm border rounded-xl shadow">
                  <thead className="sticky top-0 bg-indigo-100">
                    <tr>
                      <th className="px-3 py-2">Nom</th>
                      <th className="px-3 py-2">Acheteur</th>
                      <th className="px-3 py-2">Prix (€)</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((article, idx) => (
                      <tr key={idx} className="even:bg-slate-50 hover:bg-indigo-50 transition">
                        <td className="px-3 py-2">
                          <input value={article.nom} onChange={e => handleEdit(idx, 'nom', e.target.value)} className="w-full bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={article.acheteur || ''} onChange={e => handleEdit(idx, 'acheteur', e.target.value)} className="w-full bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={article.prix} onChange={e => handleEdit(idx, 'prix', e.target.value)} className="w-24 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500 text-right" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={article.date || ''} onChange={e => handleEdit(idx, 'date', e.target.value)} className="w-32 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(idx)}><Trash2 className="w-5 h-5" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Validation */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition-all duration-200" onClick={handleValidate}>Valider l'import</Button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau moderne de prévisualisation */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200 bg-white/90">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Acheteur</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Prix (€)</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {preview && preview.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-8">Aucun article à prévisualiser</td>
              </tr>
            )}
            {preview && preview.map((article, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50 hover:bg-indigo-50 transition-all duration-150"}>
                <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{article.nom}</td>
                <td className="px-4 py-3 text-slate-700">{article.acheteur || <span className="italic text-slate-400">-</span>}</td>
                <td className="px-4 py-3 text-indigo-700 font-bold">{article.prix}</td>
                <td className="px-4 py-3 text-slate-600">{article.date}</td>
                <td className="px-4 py-3 flex gap-2 justify-center items-center">
                  <button className="p-2 rounded-lg hover:bg-indigo-100 transition" title="Éditer" onClick={() => handleEdit(idx, 'nom', article.nom)}><Edit2 className="w-4 h-4 text-indigo-500" /></button>
                  <button className="p-2 rounded-lg hover:bg-red-100 transition" title="Supprimer" onClick={() => handleDelete(idx)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bouton de validation moderne */}
      <div className="flex justify-end mt-6">
        <Button
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:scale-105"
          onClick={handleValidate}
          disabled={!preview || preview.length === 0}
        >
          <Check className="w-5 h-5 mr-2" /> Valider l'import
        </Button>
      </div>
    </div>
  );
}

// 4. Améliorer la détection des prix et dates
// Extraction avancée du prix
function extractPrix(text: string): number {
  // Cherche un nombre (avec ou sans virgule/décimale) suivi ou non du symbole € ou e
  const match = text.match(/([0-9]+[\.,]?[0-9]*)\s*(€|e)?/i);
  if (match && match[1]) {
    return parseFloat(match[1].replace(',', '.').replace(/[^0-9.]/g, ''));
  }
  return 0;
}

// Extraction avancée de la date
function extractDate(text: string): string {
  // Formats courants : 01/05/2024, 2024-05-01, 1 mai 2024, 1er mai 2024, etc.
  const regexes = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/, // 01/05/2024 ou 01-05-2024
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,   // 2024-05-01
    /\b(\d{1,2}(er)? [a-zA-Zéûî]+ \d{4})\b/,       // 1 mai 2024, 1er mai 2024
  ];
  for (const regex of regexes) {
    const match = text.match(regex);
    if (match && match[1]) return match[1];
  }
  return '';
}

// Extraction du nom de l'article
function extractNom(text: string): string {
  // Prend la partie avant le prix ou l'acheteur si possible
  const prixIdx = text.search(/([0-9]+[\.,]?[0-9]*)\s*(€|e)?/i);
  if (prixIdx > 0) return text.slice(0, prixIdx).trim();
  return text.trim();
}

// Extraction de l'acheteur
function extractAcheteur(text: string): string {
  // Cherche un pseudo (lettres/chiffres) après "par" ou "à" ou "acheté par"
  const match = text.match(/(?:par|à|acheté par)\s*([a-zA-Z0-9_\-]+)/i);
  if (match && match[1]) return match[1];
  return '';
}

// Nettoyage et validation des lignes extraites
function cleanExtractedData(data: any[]): any[] {
  return data
    .map(row => ({
      ...row,
      nom: row.nom ? row.nom.trim() : '',
      acheteur: row.acheteur ? row.acheteur.trim() : '',
      prix: typeof row.prix === 'number' ? row.prix : extractPrix(row.prix || ''),
      date: row.date ? extractDate(row.date) : '',
    }))
    .filter(row => row.nom || row.acheteur || row.prix > 0 || row.date) // supprime les lignes vides
}

// Nouvelle fonction de parsing HTML Vinted structurée
function parseVintedHTML(html: string): Article[] {
  // Extraction par blocs Commande
  const blocks = html.split(/Commande:/).slice(1); // ignore le premier split vide
  const articles: Article[] = [];
  for (const block of blocks) {
    // Date de la commande
    const dateMatch = block.match(/(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4}|\d{4}\/\d{2}\/\d{2}|\d{4}\.\d{2}\.\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    const date = dateMatch ? dateMatch[0].split(' ')[0].replace(/\./g, '/').replace(/-/g, '/') : '';
    // Acheteur
    const acheteurMatch = block.match(/Acheteur:\s*([a-zA-Z0-9_\-]+)/);
    const acheteur = acheteurMatch ? acheteurMatch[1] : '';
    // Section articles
    const articlesSection = block.split('Articles:')[1] || '';
    // Chaque ligne d'article
    const lines = articlesSection.split(/\n|<br\s*\/?\s*>|•/).map(l => l.trim()).filter(l => l);
    for (const line of lines) {
      // Nom et prix
      const prixMatch = line.match(/([0-9]+[\.,]?[0-9]*)\s*(EUR|€)/i);
      const prix = prixMatch ? parseFloat(prixMatch[1].replace(',', '.')) : 0;
      const nom = prixMatch ? line.slice(0, prixMatch.index).replace(/[-:•]$/, '').trim() : line.trim();
      if (nom && prix > 0) {
        articles.push({ nom, acheteur, prix, date });
      }
    }
  }
  return articles;
} 