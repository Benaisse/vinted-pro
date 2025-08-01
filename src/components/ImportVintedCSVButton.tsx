"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { detectFileFormat, SupportedFormat } from "@/lib/UniversalFormatDetector";
import { VintedUniversalParser, VintedArticle } from "@/lib/VintedUniversalParser";

export function ImportVintedModal({ onImport }: { onImport: (articles: VintedArticle[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<VintedArticle[]>([]);
  const [detectedFormat, setDetectedFormat] = useState<SupportedFormat | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawContent, setRawContent] = useState<string>("");

  // Gestion du fichier ou du texte collé
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    let allArticles: VintedArticle[] = [];
    let format: SupportedFormat | null = null;
    for (const file of Array.from(files)) {
      const text = await file.text();
      format = detectFileFormat(text, file.name);
      setDetectedFormat(format);
      const articles = VintedUniversalParser.parse(text, file.name);
      allArticles = allArticles.concat(articles);
    }
    setPreview(allArticles);
    if (allArticles.length === 0) toast.error("Aucun article détecté dans les fichiers importés.");
  };
  // Gestion du collage direct
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    setRawContent(text);
    const format = detectFileFormat(text);
    setDetectedFormat(format);
    const articles = VintedUniversalParser.parse(text);
    setPreview(articles);
    if (articles.length === 0) toast.error("Aucun article détecté dans le texte collé.");
  };
  // Validation
  const handleValidate = () => {
    if (preview.length === 0) return toast.error("Aucun article à importer.");
    onImport(preview);
    setPreview([]);
    setRawContent("");
    setDetectedFormat(null);
    toast.success("Articles importés avec succès !");
    setModalOpen(false);
  };
  // Suppression d'un article
  const handleDelete = (idx: number) => {
    setPreview(preview.filter((_, i) => i !== idx));
  };
  // Edition inline (optionnel)
  const handleEdit = (idx: number, field: string, value: string) => {
    const updated = [...preview];
    updated[idx] = { ...updated[idx], [field]: value };
    setPreview(updated);
  };
  return (
    <div>
      <Button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200">
        <Upload className="w-5 h-5 mr-2" /> Importer Vinted
      </Button>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative animate-fade-in">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setModalOpen(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold mb-2 text-indigo-700">Importer vos données Vinted</h2>
            <p className="mb-4 text-slate-600">Glissez-déposez un ou plusieurs fichiers (HTML, CSV, TXT, JSON, XML) ou collez directement vos données. Le format est détecté automatiquement.</p>
            <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition" onClick={() => inputRef.current?.click()}>
              <Upload className="w-10 h-10 text-indigo-400 mb-2" />
              <span className="text-indigo-600 font-semibold">Déposez vos fichiers ici ou cliquez pour choisir</span>
              <input ref={inputRef} type="file" accept=".csv,.html,.htm,.txt,.json,.xml" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
            </div>
            <div className="mb-4">
              <textarea
                className="w-full border border-indigo-200 rounded-xl p-3 text-sm mb-2"
                rows={3}
                placeholder="Ou collez vos données Vinted ici..."
                value={rawContent}
                onChange={e => {
                  setRawContent(e.target.value);
                  const format = detectFileFormat(e.target.value);
                  setDetectedFormat(format);
                  const articles = VintedUniversalParser.parse(e.target.value);
                  setPreview(articles);
                }}
                onPaste={handlePaste}
              />
              {detectedFormat && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <Check className="h-4 w-4" />
                  Format détecté: {detectedFormat.toUpperCase()}
                </div>
              )}
            </div>
            {preview && preview.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {preview.length} article{preview.length > 1 ? 's' : ''} trouvé{preview.length > 1 ? 's' : ''}
                    </div>
                    <span className="text-slate-600 text-sm">Aperçu des données extraites</span>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96 mb-4">
                  <table className="min-w-full text-sm border rounded-xl shadow">
                    <thead className="sticky top-0 bg-indigo-100">
                      <tr>
                        <th className="px-3 py-2">Nom</th>
                        <th className="px-3 py-2">Catégorie</th>
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
                            <input value={article.categorie || ''} onChange={e => handleEdit(idx, 'categorie', e.target.value)} className="w-full bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500" />
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
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition-all duration-200" onClick={handleValidate}>Valider l'import</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 