import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { parseVintedData } from "./VintedDataParser";
import { useVintedImport } from "@/hooks/useVintedImport";

interface ImportVintedButtonProps {
  onImportSuccess?: () => void;
}

export const ImportVintedButton: React.FC<ImportVintedButtonProps> = ({ onImportSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { importVintedData } = useVintedImport();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const commandes = parseVintedData(text);
      const result = await importVintedData(commandes);
      if (result.success) {
        // @ts-ignore
        window?.toast?.success?.("Import Vinted réussi !");
        onImportSuccess?.();
      } else {
        // @ts-ignore
        window?.toast?.error?.("Erreur lors de l'import Vinted");
      }
    } catch (err) {
      // @ts-ignore
      window?.toast?.error?.("Erreur lors de l'import Vinted");
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-5 h-5" />
        Importer Vinted
      </Button>
    </>
  );
}; 