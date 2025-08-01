"use client";
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Article {
  id: number;
  nom: string;
  categorie: string;
  description?: string;
  etat: string;
  marque?: string;
  taille?: string;
  prix: number;
  cout: number;
  marge: number;
  marge_pourcent: number;
  statut: "En vente" | "Vendu" | "Archivé";
  vues: number;
  likes: number;
  dateAjout: string;
  image?: string;
}

interface ArticleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (article: Article) => void;
  article?: Article | null;
}

const ETATS = ["Neuf", "Très bon état", "Bon état", "Correct"];
const CATEGORIES = ["Vêtements", "Chaussures", "Sacs", "Accessoires"];

export function ArticleFormModal({ open, onClose, onSubmit, article }: ArticleFormModalProps) {
  const [formData, setFormData] = useState<Article>({
    id: Date.now(),
    nom: "",
    categorie: "",
    description: "",
    etat: "Très bon état",
    marque: "",
    taille: "",
    prix: 0,
    cout: 0,
    marge: 0,
    marge_pourcent: 0,
    statut: "En vente",
    vues: 0,
    likes: 0,
    dateAjout: new Date().toLocaleDateString("fr-FR"),
    image: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        marge: article.marge ?? 0,
        marge_pourcent: article.marge_pourcent ?? 0,
        vues: article.vues ?? 0,
        likes: article.likes ?? 0,
        dateAjout: article.dateAjout || new Date().toLocaleDateString("fr-FR"),
      });
      setImagePreview(article.image || null);
    } else {
      setFormData({
        id: Date.now(),
        nom: "",
        categorie: "",
        description: "",
        etat: "Très bon état",
        marque: "",
        taille: "",
        prix: 0,
        cout: 0,
        marge: 0,
        marge_pourcent: 0,
        statut: "En vente",
        vues: 0,
        likes: 0,
        dateAjout: new Date().toLocaleDateString("fr-FR"),
        image: ""
      });
      setImagePreview(null);
    }
  }, [article]);

  useEffect(() => {
    if (open) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
      // Focus trap
      const handleTab = (e: KeyboardEvent) => {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else {
      lastActiveElement.current?.focus();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as any;
    if (type === "file" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.prix || !formData.cout || !formData.categorie || !formData.etat) return;
    let imageUrl = formData.image;
    const marge = formData.prix - formData.cout;
    const margePourcent = formData.prix ? Math.round((marge / formData.prix) * 100) : 0;
    onSubmit({
      ...formData,
      id: formData.id || Date.now(),
      etat: formData.etat || "Très bon état",
      marge,
      marge_pourcent: margePourcent,
      vues: formData.vues ?? 0,
      likes: formData.likes ?? 0,
      dateAjout: formData.dateAjout || new Date().toLocaleDateString("fr-FR"),
      image: imageUrl || ""
    });
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="article-modal-title" className="text-xl font-semibold text-gray-900">
              {article ? "Modifier l'article" : "Ajouter un article"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fermer le modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
              <input ref={firstInputRef} type="file" accept="image/*" name="image" onChange={handleInputChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {imagePreview && (
                <img src={imagePreview} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg border mt-2" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'article *</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Titre de l'article" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select name="categorie" value={formData.categorie} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">État *</label>
              <select name="etat" value={formData.etat} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                {ETATS.map(etat => <option key={etat} value={etat}>{etat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input type="text" name="marque" value={formData.marque} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Zara, Nike..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
              <input type="text" name="taille" value={formData.taille} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: M, 38, 42..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Décris ton article (matière, coupe, détails, etc.)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (€) *</label>
              <input type="number" name="prix" value={formData.prix} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="25.00" step="0.01" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût d'achat (€) *</label>
              <input type="number" name="cout" value={formData.cout} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="5.00" step="0.01" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select name="statut" value={formData.statut} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="En vente">En vente</option>
                <option value="Vendu">Vendu</option>
                <option value="Archivé">Archivé</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{article ? "Modifier l'article" : "Ajouter l'article"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 