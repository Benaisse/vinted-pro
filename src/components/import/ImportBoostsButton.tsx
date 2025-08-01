"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Check, X, Edit, Trash2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { BoostFormData } from "@/types/boosts";

// Déclaration des types pour window.toast
declare global {
  interface Window {
    toast?: {
      success: (message: string) => void;
      error: (message: string) => void;
    };
  }
}

interface ImportBoostsButtonProps {
  onImportSuccess?: () => void;
}

interface VintedBoostItem {
  date_commande: string;
  montant_regle: number;
  porte_monnaie_vinted: number;
  duree_jours: number;
  identifiant_article: number;
}

export const ImportBoostsButton: React.FC<ImportBoostsButtonProps> = ({ onImportSuccess }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addBoost } = useData();
  const { user } = useAuth();
  const [previewData, setPreviewData] = useState<VintedBoostItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const parseBoostsHTML = (content: string): VintedBoostItem[] => {
    const items: VintedBoostItem[] = [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const allText = doc.body.textContent || '';
      const lines = allText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      console.log("=== DÉBUT PARSING HTML ===");
      console.log("Nombre de lignes:", lines.length);
      
      let currentBoost: Partial<VintedBoostItem> = {};
      let inBoostSection = false;
      let boostCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Détecter le début d'une section boost
        if (line.includes('Commandé le')) {
          console.log(`=== DÉBUT BOOST ${boostCount + 1} ===`);
          console.log("Ligne avec 'Commandé le':", line);
          inBoostSection = true;
          currentBoost = {};
          
          // Chercher la date sur la ligne suivante
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            console.log("Ligne suivante pour date:", nextLine);
            const dateMatch = nextLine.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+\+\d{4})/);
            console.log("Regex date match:", dateMatch);
            if (dateMatch) {
              currentBoost.date_commande = new Date(dateMatch[1]).toISOString();
              console.log("✅ Date trouvée:", currentBoost.date_commande);
            } else {
              console.log("❌ Date non trouvée dans:", nextLine);
            }
          }
          continue;
        }
        
        if (!inBoostSection) continue;
        
        // Chercher le montant réglé
        if (line.includes('Montant réglé') && !currentBoost.montant_regle) {
          // Chercher la valeur sur la ligne suivante
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const amountMatch = nextLine.match(/(\d+\.?\d*)\s*EUR/);
            if (amountMatch) {
              currentBoost.montant_regle = parseFloat(amountMatch[1]);
              console.log("✅ Montant trouvé:", currentBoost.montant_regle);
            }
          }
        }
        
        // Chercher la durée
        if (line.includes('Durée') && !currentBoost.duree_jours) {
          // Chercher la valeur sur la ligne suivante
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const dureeMatch = nextLine.match(/(\d+)/);
            if (dureeMatch) {
              currentBoost.duree_jours = parseInt(dureeMatch[1]);
              console.log("✅ Durée trouvée:", currentBoost.duree_jours);
            }
          }
        }
        
        // Chercher l'identifiant article
        if (line.includes('Identifiants article') && !currentBoost.identifiant_article) {
          // Chercher la valeur sur la ligne suivante
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const idMatch = nextLine.match(/(\d+)/);
            if (idMatch) {
              currentBoost.identifiant_article = parseInt(idMatch[1]);
              console.log("✅ ID article trouvé:", currentBoost.identifiant_article);
            }
          }
        }
        
        // Si on a toutes les données, ajouter le boost
        if (currentBoost.date_commande && currentBoost.montant_regle && 
            currentBoost.duree_jours && currentBoost.identifiant_article) {
          currentBoost.porte_monnaie_vinted = currentBoost.montant_regle;
          items.push(currentBoost as VintedBoostItem);
          boostCount++;
          console.log(`✅ Boost ${boostCount} complet ajouté:`, currentBoost);
          currentBoost = {};
          inBoostSection = false;
        }
        
        // Si on rencontre une ligne vide, fin de section
        if (line === '' && inBoostSection) {
          console.log("📝 Fin de section boost");
          inBoostSection = false;
          if (Object.keys(currentBoost).length > 0) {
            console.log("⚠️ Boost incomplet ignoré:", currentBoost);
          }
          currentBoost = {};
        }
      }
      
      // Vérifier s'il reste un boost en cours
      if (currentBoost.date_commande && currentBoost.montant_regle && 
          currentBoost.duree_jours && currentBoost.identifiant_article) {
        currentBoost.porte_monnaie_vinted = currentBoost.montant_regle;
        items.push(currentBoost as VintedBoostItem);
        boostCount++;
        console.log(`✅ Dernier boost ${boostCount} ajouté:`, currentBoost);
      }
      
      console.log(`=== FIN PARSING HTML - ${items.length} boosts trouvés ===`);
      return items;
    } catch (error) {
      console.error('Erreur lors du parsing HTML:', error);
      return [];
    }
  };

  const parseBoostsCSV = (content: string): VintedBoostItem[] => {
    const items: VintedBoostItem[] = [];
    
    try {
      const lines = content.split('\n');
      
      // Ignorer la première ligne (en-têtes)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
        
        if (parts.length >= 5) {
          const [dateStr, montantStr, porteMonnaieStr, dureeStr, idStr] = parts;
          
          // Parser la date
          let date_commande: string;
          try {
            // Essayer différents formats de date
            if (dateStr.includes('+')) {
              // Format: 2025-06-18 12:28:03 +0200
              date_commande = new Date(dateStr).toISOString();
            } else if (dateStr.includes('-')) {
              // Format: 2025-06-18
              date_commande = new Date(dateStr + 'T00:00:00').toISOString();
            } else {
              // Format français: 18/06/2025
              const [day, month, year] = dateStr.split('/');
              date_commande = new Date(`${year}-${month}-${day}T00:00:00`).toISOString();
            }
          } catch {
            date_commande = new Date().toISOString();
          }
          
          items.push({
            date_commande,
            montant_regle: parseFloat(montantStr) || 0,
            porte_monnaie_vinted: parseFloat(porteMonnaieStr) || 0,
            duree_jours: parseInt(dureeStr) || 0,
            identifiant_article: parseInt(idStr) || 0
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du parsing CSV:", error);
    }
    
    return items;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!user) {
      alert("Vous devez être connecté pour importer des données");
      return;
    }
    
    try {
      console.log("Import du fichier:", file.name);
      
      const content = await file.text();
      let items: VintedBoostItem[] = [];
      
      // Détecter le type de fichier et parser en conséquence
      if (file.name.toLowerCase().endsWith('.html') || content.includes('<!DOCTYPE') || content.includes('<html')) {
        console.log("Parsing HTML pour les boosts");
        items = parseBoostsHTML(content);
      } else {
        console.log("Parsing CSV pour les boosts");
        items = parseBoostsCSV(content);
      }
      
      console.log(`${items.length} boosts trouvés`);
      
      if (items.length === 0) {
        throw new Error("Aucun boost trouvé dans le fichier. Vérifiez le format.");
      }
      
      // Afficher la prévisualisation
      setPreviewData(items);
      setShowPreview(true);
      
    } catch (err) {
      console.error("Erreur import:", err);
      const errorMessage = "Erreur lors de l'import des boosts. Vérifiez le format du fichier.";
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const item of previewData) {
        try {
          if (item.identifiant_article > 0) {
            await addBoost(item);
            successCount++;
            
            // Petit délai pour éviter de surcharger l'API
            await new Promise(resolve => setTimeout(resolve, 100));
          } else {
            console.warn("Boost ignoré - ID article invalide:", item);
            errorCount++;
          }
        } catch (err) {
          console.error("Erreur lors de l'ajout du boost:", item, err);
          errorCount++;
        }
      }
      
      const message = `Import terminé : ${successCount} boosts ajoutés${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`;
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(message);
      } else {
        alert(message);
      }
      
      setShowPreview(false);
      setPreviewData([]);
      onImportSuccess?.();
      
    } catch (err) {
      console.error("Erreur lors de l'import:", err);
      alert("Erreur lors de l'import des boosts.");
    }
  };

  const handleEditItem = (index: number, field: keyof VintedBoostItem, value: any) => {
    const newData = [...previewData];
    newData[index] = { ...newData[index], [field]: value };
    setPreviewData(newData);
  };

  const handleDeleteItem = (index: number) => {
    const newData = previewData.filter((_, i) => i !== index);
    setPreviewData(newData);
  };

  const createSampleCSV = () => {
    const sampleData = `Date,Montant réglé,Porte-monnaie Vinted,Durée,ID Article
2025-06-18 12:28:03 +0200,0.0,0.0,3,6526557173
2025-06-27 19:07:12 +0200,2.14,2.14,7,6557297963
2025-06-27 19:07:51 +0200,1.43,1.43,3,6550724172
2025-06-27 19:08:42 +0200,1.38,1.38,3,6550824569
2025-06-29 07:39:58 +0200,1.43,1.43,3,6588213513
2025-06-29 07:40:21 +0200,1.43,1.43,3,6550663784`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemple_boosts_vinted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.html,.txt"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Importer des boosts
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={createSampleCSV}
        >
          <Download className="w-4 h-4" />
          Télécharger exemple CSV
        </Button>
      </div>

      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prévisualisation des boosts ({previewData.length})</h3>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmImport}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Confirmer l'import
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="w-4 h-4" />
                  Annuler
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-3 py-2 text-left">Date</th>
                    <th className="border px-3 py-2 text-left">ID Article</th>
                    <th className="border px-3 py-2 text-left">Montant (€)</th>
                    <th className="border px-3 py-2 text-left">Durée (jours)</th>
                    <th className="border px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        <input
                          type="date"
                          value={item.date_commande.split('T')[0]}
                          onChange={(e) => handleEditItem(index, 'date_commande', new Date(e.target.value).toISOString())}
                          className="w-full border-none bg-transparent"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          value={item.identifiant_article}
                          onChange={(e) => handleEditItem(index, 'identifiant_article', parseInt(e.target.value))}
                          className="w-full border-none bg-transparent"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.montant_regle}
                          onChange={(e) => handleEditItem(index, 'montant_regle', parseFloat(e.target.value))}
                          className="w-full border-none bg-transparent"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        <input
                          type="number"
                          value={item.duree_jours}
                          onChange={(e) => handleEditItem(index, 'duree_jours', parseInt(e.target.value))}
                          className="w-full border-none bg-transparent"
                        />
                      </td>
                      <td className="border px-3 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 