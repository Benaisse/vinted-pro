"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, TrendingUp, DollarSign, Calendar, Package, AlertTriangle, Edit, Trash2, X, Check, Clock, BarChart3, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/contexts/DataContext";
import { Toast } from "@/components/ui/Toast";
import { Boost, BoostFormData } from "@/types/boosts";
import { ImportBoostsButton } from "@/components/import/ImportBoostsButton";

export default function BoostsPage() {
  const { boosts, addBoost, updateBoost, deleteBoost } = useData();
  const [recherche, setRecherche] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [boostEnEdition, setBoostEnEdition] = useState<Boost | null>(null);
  const [formData, setFormData] = useState<BoostFormData>({
    date_commande: new Date().toISOString().split('T')[0],
    montant_regle: 0,
    porte_monnaie_vinted: 0,
    duree_jours: 3,
    identifiant_article: 0
  });
  const [messageSucces, setMessageSucces] = useState("");

  // Filtrage des boosts
  const boostsFiltres = useMemo(() => {
    return boosts.filter((boost) => {
      const matchRecherche = boost.identifiant_article.toString().includes(recherche);
      return matchRecherche;
    });
  }, [boosts, recherche]);

  // Statistiques
  const stats = useMemo(() => {
    const total = boosts.length;
    const totalDepense = boosts.reduce((sum, b) => sum + b.montant_regle, 0);
    const moyenneParBoost = total > 0 ? totalDepense / total : 0;
    const totalDuree = boosts.reduce((sum, b) => sum + b.duree_jours, 0);
    
    // Boosts ce mois
    const maintenant = new Date();
    const boostsCeMois = boosts.filter(b => {
      const dateBoost = new Date(b.date_commande);
      return dateBoost.getMonth() === maintenant.getMonth() && 
             dateBoost.getFullYear() === maintenant.getFullYear();
    });
    const depenseCeMois = boostsCeMois.reduce((sum, b) => sum + b.montant_regle, 0);

    return { 
      total, 
      totalDepense, 
      moyenneParBoost, 
      totalDuree, 
      boostsCeMois: boostsCeMois.length, 
      depenseCeMois 
    };
  }, [boosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (boostEnEdition) {
        await updateBoost({ ...boostEnEdition, ...formData });
        setMessageSucces("Boost mis à jour avec succès !");
      } else {
        await addBoost(formData);
        setMessageSucces("Boost ajouté avec succès !");
      }
      setModalOuvert(false);
      setBoostEnEdition(null);
      setFormData({
        date_commande: new Date().toISOString().split('T')[0],
        montant_regle: 0,
        porte_monnaie_vinted: 0,
        duree_jours: 3,
        identifiant_article: 0
      });
      setTimeout(() => setMessageSucces(""), 3000);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (boost: Boost) => {
    setBoostEnEdition(boost);
    setFormData({
      date_commande: boost.date_commande.split('T')[0],
      montant_regle: boost.montant_regle,
      porte_monnaie_vinted: boost.porte_monnaie_vinted,
      duree_jours: boost.duree_jours,
      identifiant_article: boost.identifiant_article
    });
    setModalOuvert(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce boost ?")) {
      await deleteBoost(id);
      setMessageSucces("Boost supprimé avec succès !");
      setTimeout(() => setMessageSucces(""), 3000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="boosts-page"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Boosts Vinted
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Gérez vos promotions et dépenses publicitaires</p>
            </div>
            <div className="flex items-center gap-3">
              <ImportBoostsButton />
              <Button 
                onClick={() => setModalOuvert(true)} 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Ajouter un boost
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Message de succès */}
        <AnimatePresence>
          {messageSucces && <Toast message={messageSucces} type="success" />}
        </AnimatePresence>

        {/* Cartes de statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total boosts"
            value={stats.total.toString()}
            subtitle="Promotions"
            icon={<Sparkles className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Dépense totale"
            value={stats.totalDepense.toFixed(2) + '€'}
            subtitle="Investissement"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Moyenne par boost"
            value={stats.moyenneParBoost.toFixed(2) + '€'}
            subtitle="Coût moyen"
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Boosts ce mois"
            value={stats.boostsCeMois.toString()}
            subtitle="Ce mois-ci"
            icon={<Calendar className="w-6 h-6" />}
            color="orange"
          />
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher par ID article..."
                className="pl-10"
              />
            </div>
            {recherche && (
              <Button
                variant="ghost"
                onClick={() => setRecherche("")}
                className="text-slate-600 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Liste des boosts */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID Article</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Porte-monnaie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Durée</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {boostsFiltres.map((boost) => (
                  <tr key={boost.id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {new Date(boost.date_commande).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {boost.identifiant_article}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {boost.montant_regle.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {boost.porte_monnaie_vinted.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {boost.duree_jours} jour{boost.duree_jours > 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => handleEdit(boost)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(boost.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modalOuvert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setModalOuvert(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">
                  {boostEnEdition ? "Modifier le boost" : "Ajouter un boost"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date de commande
                    </label>
                    <Input
                      type="date"
                      value={formData.date_commande}
                      onChange={(e) => setFormData({...formData, date_commande: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ID Article
                    </label>
                    <Input
                      type="number"
                      value={formData.identifiant_article}
                      onChange={(e) => setFormData({...formData, identifiant_article: parseInt(e.target.value)})}
                      placeholder="6526557173"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Montant réglé (€)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.montant_regle}
                      onChange={(e) => setFormData({...formData, montant_regle: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Porte-monnaie Vinted (€)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.porte_monnaie_vinted}
                      onChange={(e) => setFormData({...formData, porte_monnaie_vinted: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Durée (jours)
                    </label>
                    <Input
                      type="number"
                      value={formData.duree_jours}
                      onChange={(e) => setFormData({...formData, duree_jours: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      {boostEnEdition ? "Modifier" : "Ajouter"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setModalOuvert(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { 
  title: string, 
  value: string, 
  subtitle: string, 
  icon: React.ReactNode,
  color: string
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
} 