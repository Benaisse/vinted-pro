import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { VintedUniversalParser, VintedArticle } from "@/lib/VintedUniversalParser";

// Déclaration des types pour window.toast
declare global {
  interface Window {
    toast?: {
      success: (message: string) => void;
      error: (message: string) => void;
    };
  }
}

interface ImportVintedButtonProps {
  onImportSuccess?: () => void;
}

export const ImportVintedButton: React.FC<ImportVintedButtonProps> = ({ onImportSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addArticle, articles, deleteAllArticles } = useData();
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = async () => {
    if (!user) {
      alert("Vous devez être connecté pour supprimer des données");
      return;
    }

    try {
      await deleteAllArticles();
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success("Toutes les données ont été supprimées");
      } else {
        alert("Toutes les données ont été supprimées");
      }
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      const errorMessage = "Erreur lors de la suppression des données";
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!user) {
      alert("Vous devez être connecté pour importer des données");
      return;
    }

    // Demander confirmation si des données existent
    if (articles.length > 0) {
      const shouldClear = confirm(
        `Vous avez déjà ${articles.length} articles dans votre inventaire.\n\n` +
        "Voulez-vous :\n" +
        "• Vider les données existantes avant l'import (recommandé)\n" +
        "• Ajouter les nouveaux articles sans supprimer les existants\n" +
        "• Annuler l'import"
      );

      if (shouldClear === null) return; // Annulé
      
      if (shouldClear) {
        try {
          await deleteAllArticles();
          if (typeof window !== 'undefined' && window.toast) {
            window.toast.success("Données existantes supprimées");
          }
        } catch (err) {
          console.error("Erreur lors de la suppression:", err);
          return;
        }
      }
    }
    
    setIsImporting(true);
    
    try {
      console.log("Import du fichier:", file.name);
      
      const content = await file.text();
      const items = VintedUniversalParser.parse(content, file.name);
      
      console.log(`${items.length} articles trouvés`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const item of items) {
        try {
          // Calculer la marge
          const cout = item.cout || (item.prix * 0.2); // 20% du prix par défaut
          const marge = item.prix - cout;
          const margePourcent = item.prix > 0 ? (marge / item.prix) * 100 : 0;
          
          const article = {
            id: 0, // Sera généré par Supabase
            nom: item.nom,
            categorie: item.categorie && ["Vêtements", "Chaussures", "Sacs", "Accessoires"].includes(item.categorie)
              ? item.categorie
              : VintedUniversalParser.extractCategoryFromName(item.nom),
            description: item.description || '',
            etat: item.etat || 'Très bon état',
            marque: item.marque || '',
            taille: item.taille || '',
            prix: item.prix,
            cout: cout,
            statut: 'En vente' as const,
            vues: 0,
            likes: 0,
            dateAjout: new Date().toISOString().split('T')[0],
            image: item.image || '',
            marge: marge,
            marge_pourcent: margePourcent
          };
          
          await addArticle(article);
          successCount++;
          
          // Petit délai pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (err) {
          console.error("Erreur lors de l'ajout de l'article:", item.nom, err);
          errorCount++;
        }
      }
      
      const message = `Import terminé : ${successCount} articles ajoutés${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`;
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(message);
      } else {
        alert(message);
      }
      
      onImportSuccess?.();
      
    } catch (err) {
      console.error("Erreur import:", err);
      const errorMessage = "Erreur lors de l'import Vinted. Vérifiez le format du fichier.";
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.html,.txt,.json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        variant="default"
        disabled={isImporting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-5 h-5" />
        {isImporting ? "Import en cours..." : "Importer Vinted"}
      </Button>
      
      {articles.length > 0 && (
        <Button
          variant="destructive"
          className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105"
          onClick={() => setShowClearConfirm(true)}
        >
          <Trash2 className="w-5 h-5" />
          Vider ({articles.length})
        </Button>
      )}

      {/* Modal de confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer tous les {articles.length} articles de votre inventaire ? 
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearData}
              >
                Supprimer tout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 