"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  AlertTriangle,
  Settings,
  CreditCard,
  Globe,
  Palette,
  Database,
  LogOut,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  X,
  Check,
  Clock,
  Truck,
  Users,
  BarChart3,
  Sparkles,
  AlertCircle
} from "lucide-react";
import AbonnementPage from "../abonnement/page";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("compte");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    alertes: true,
    rapports: true
  });
  const [formData, setFormData] = useState({
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "123 Rue de la Paix, 75001 Paris",
    entreprise: "Ma Boutique Vinted"
  });
  const [messageSucces, setMessageSucces] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    setMessageSucces("Paramètres sauvegardés avec succès !");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const handleExportData = () => {
    setMessageSucces("Export de vos données en cours...");
    setTimeout(() => setMessageSucces(""), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (confirmed) {
      setMessageSucces("Suppression du compte en cours...");
      setTimeout(() => setMessageSucces(""), 3000);
    }
  };

  const tabs = [
    { id: "compte", label: "Compte", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "securite", label: "Sécurité", icon: <Shield className="w-4 h-4" /> },
    { id: "abonnement", label: "Abonnement", icon: <CreditCard className="w-4 h-4" /> },
    { id: "donnees", label: "Données", icon: <Database className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header avec titre */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Gérez votre compte et vos préférences</p>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {messageSucces && <Toast message={messageSucces} type="success" />}

      {/* Navigation par onglets modernisée */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Compte */}
          {activeTab === "compte" && (
            <div className="space-y-8">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                    <Input
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <Input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                      className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
                    <Input
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleInputChange}
                      placeholder="Nom de votre entreprise"
                      className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adresse</label>
                    <Input
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                      className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  Apparence
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="font-medium text-slate-900">Thème</h4>
                    <p className="text-sm text-slate-500">Choisissez entre clair et sombre</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600" />
                  </div>
                  Préférences de notifications
                </h3>
                
                <div className="space-y-4">
                  <NotificationToggle
                    title="Notifications par email"
                    description="Recevez des mises à jour importantes par email"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Notifications push"
                    description="Recevez des alertes en temps réel"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange("push")}
                    icon={<Bell className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Notifications SMS"
                    description="Recevez des alertes par SMS"
                    checked={notifications.sms}
                    onChange={() => handleNotificationChange("sms")}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Marketing"
                    description="Recevez des offres et promotions"
                    checked={notifications.marketing}
                    onChange={() => handleNotificationChange("marketing")}
                    icon={<Sparkles className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Alertes de stock"
                    description="Soyez informé des stocks faibles"
                    checked={notifications.alertes}
                    onChange={() => handleNotificationChange("alertes")}
                    icon={<AlertTriangle className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Rapports hebdomadaires"
                    description="Recevez un résumé de vos performances"
                    checked={notifications.rapports}
                    onChange={() => handleNotificationChange("rapports")}
                    icon={<BarChart3 className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "securite" && (
            <div className="space-y-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  Sécurité du compte
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Changer le mot de passe</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe actuel</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Votre mot de passe actuel"
                            className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nouveau mot de passe"
                            className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer le nouveau mot de passe"
                            className="bg-white/50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Activer l'authentification à deux facteurs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Abonnement */}
          {activeTab === "abonnement" && (
            <div>
              <AbonnementPage />
            </div>
          )}

          {/* Onglet Données */}
          {activeTab === "donnees" && (
            <div className="space-y-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-blue-600" />
                  </div>
                  Gestion des données
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-900">Exporter mes données</h4>
                      <p className="text-sm text-slate-500">Téléchargez une copie de toutes vos données</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exporter
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-200">
                    <div>
                      <h4 className="font-medium text-red-900">Supprimer mon compte</h4>
                      <p className="text-sm text-red-600">Cette action est irréversible</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composants utilitaires
function NotificationToggle({ 
  title, 
  description, 
  checked, 
  onChange, 
  icon 
}: { 
  title: string, 
  description: string, 
  checked: boolean, 
  onChange: () => void,
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:bg-white/70 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-slate-900">{title}</h4>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function Toast({ message, type }: { message: string, type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
      type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <Check className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
} 