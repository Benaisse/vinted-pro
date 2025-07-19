import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Simulation d'un import simple
      console.log("Import du fichier:", file.name);
      
      // Notification de succès
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success("Import Vinted réussi !");
      } else {
        alert("Import Vinted réussi !");
      }
      
      onImportSuccess?.();
    } catch (err) {
      console.error("Erreur import:", err);
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error("Erreur lors de l'import Vinted");
      } else {
        alert("Erreur lors de l'import Vinted");
      }
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.html,.txt,.json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        variant="default"
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-5 h-5" />
        Importer Vinted
      </Button>
    </>
  );
}; 