"use client";
import React, { useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Article } from "@/components/ArticleFormModal";
import type { ParseResult } from "papaparse";
import { Upload } from "lucide-react";

interface ImportVintedCSVButtonProps {
  onImport: (articles: Article[]) => void;
}

export function ImportVintedCSVButton({ onImport }: ImportVintedCSVButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<any>) => {
        try {
          // Adapter ici selon le format CSV Vinted
          const articles: Article[] = results.data.map((row: any) => {
            const prix = Number(row["Prix"] || row["Prix de vente"] || 0);
            const cout = Number(row["Prix d'achat"] || row["Coût"] || 0);
            const marge = prix - cout;
            const margePourcent = prix ? Math.round((marge / prix) * 100) : 0;
            return {
              id: Date.now() + Math.random(),
              nom: row["Titre"] || row["Nom"] || "",
              categorie: row["Catégorie"] || "",
              description: row["Description"] || "",
              etat: row["État"] || row["Etat"] || "Très bon état",
              marque: row["Marque"] || "",
              taille: row["Taille"] || "",
              prix,
              cout,
              marge,
              margePourcent,
              statut: "En vente",
              vues: Number(row["Vues"] || 0),
              likes: Number(row["Likes"] || 0),
              image: "",
              dateAjout: row["Date"] || new Date().toLocaleDateString("fr-FR"),
            };
          });
          onImport(articles);
          toast.success("Import Vinted réussi !");
        } catch (err) {
          toast.error("Erreur lors de l'import du CSV");
        }
      },
      error: () => toast.error("Erreur lors de la lecture du fichier")
    });
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        onClick={() => inputRef.current?.click()}
        className="mb-2 font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all flex items-center gap-2 border-2 border-blue-700"
        style={{ boxShadow: '0 2px 8px 0 rgba(30, 64, 175, 0.10)' }}
      >
        <Upload className="w-5 h-5" />
        Importer CSV Vinted
      </Button>
    </>
  );
} 