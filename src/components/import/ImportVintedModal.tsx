import React, { useRef, useState } from "react";
import { parseVintedData } from "./VintedDataParser";
import { VintedCommand } from "@/types/vinted";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
// import VintedPreview plus tard

interface ImportVintedModalProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess: (data: VintedCommand[]) => void;
}

export function ImportVintedModal({ open, onClose, onImportSuccess }: ImportVintedModalProps) {
  const [step, setStep] = useState<'select' | 'preview' | 'done'>('select');
  const [rawData, setRawData] = useState<string>("");
  const [commands, setCommands] = useState<VintedCommand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // Drag & drop/copy-paste handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError("");
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    setError("");
    const text = e.clipboardData.getData("text/plain");
    if (text) setRawData(text);
  };
  const readFile = (file: File) => {
    setLoading(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setRawData(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      setError("Erreur de lecture du fichier");
      setLoading(false);
    };
    reader.readAsText(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) readFile(e.target.files[0]);
  };
  const handleParse = () => {
    setLoading(true);
    setError("");
    try {
      const parsed = parseVintedData(rawData);
      if (!parsed.length) throw new Error("Aucune commande détectée");
      setCommands(parsed);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'extraction des données");
    } finally {
      setLoading(false);
    }
  };
  const handleValidate = () => {
    onImportSuccess(commands);
    setStep('done');
  };
  const handleEdit = (idx: number, cmd: VintedCommand) => {
    setCommands(cmds => cmds.map((c, i) => i === idx ? cmd : c));
  };
  const handleDelete = (idx: number) => {
    setCommands(cmds => cmds.filter((_, i) => i !== idx));
  };
  const handleReset = () => {
    setStep('select');
    setRawData("");
    setCommands([]);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-auto bg-white/80 rounded-2xl shadow-2xl p-0 overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-bold text-slate-800">Importer des données Vinted</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        {/* Body */}
        <div className="p-8 min-h-[350px] flex flex-col gap-6" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onPaste={handlePaste}>
          {step === 'select' && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-lg mx-auto border-2 border-dashed border-indigo-300 rounded-xl p-8 bg-white/60 text-center cursor-pointer hover:bg-indigo-50 transition-all duration-200"
                  onClick={() => inputRef.current?.click()}>
                  <Upload className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                  <div className="font-semibold text-indigo-700">Glissez-déposez un fichier Vinted (HTML, TXT, CSV) ou cliquez pour sélectionner</div>
                  <div className="text-xs text-slate-500 mt-1">Vous pouvez aussi coller les données directement (Ctrl+V)</div>
                  <input ref={inputRef} type="file" accept=".html,.htm,.txt,.csv" className="hidden" onChange={handleFileChange} />
                </div>
                {rawData && <Button onClick={handleParse} disabled={loading} className="mt-4">Analyser les données</Button>}
                {error && <div className="text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                {loading && <div className="text-indigo-600">Chargement...</div>}
              </div>
            </>
          )}
          {step === 'preview' && (
            <>
              {/* TODO: Remplacer par <VintedPreview ... /> */}
              <div className="mb-4 text-slate-700 font-semibold">Prévisualisation des commandes extraites ({commands.length})</div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/90 shadow-inner">
                <table className="min-w-full text-sm">
                  <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                    <tr>
                      <th className="p-3 text-left">N° Commande</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Statut</th>
                      <th className="p-3 text-left">Acheteur</th>
                      <th className="p-3 text-left">Montant</th>
                      <th className="p-3 text-left">Articles</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commands.map((cmd, idx) => (
                      <tr key={cmd.id} className="even:bg-slate-50 hover:bg-indigo-50 transition-all">
                        <td className="p-3 font-mono">{cmd.numeroCommande}</td>
                        <td className="p-3">{cmd.dateCommande.toLocaleDateString()}</td>
                        <td className="p-3">{cmd.statut}</td>
                        <td className="p-3">{cmd.acheteur}</td>
                        <td className="p-3">{cmd.montantTotal.toFixed(2)} €</td>
                        <td className="p-3">
                          <ul className="list-disc pl-4">
                            {cmd.articles.map(a => <li key={a.id}>{a.nom} <span className="text-xs text-slate-500">({a.prixUnitaire}€)</span></li>)}
                          </ul>
                        </td>
                        <td className="p-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(idx, cmd)}>Éditer</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(idx)}>Supprimer</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button variant="ghost" onClick={handleReset}>Annuler</Button>
                <Button onClick={handleValidate} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-all">Valider l'import</Button>
              </div>
            </>
          )}
          {step === 'done' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div className="text-lg font-bold text-green-700">Import réussi !</div>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 