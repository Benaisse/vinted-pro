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
  EyeOff
} from "lucide-react";
import AbonnementPage from "../abonnement/page";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("compte");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = setNotificationsState();
  const [formData, setFormData] = useState({
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "123 Rue de la Paix, 75001 Paris",
    entreprise: "Ma Boutique Vinted"
  });

  function setNotificationsState() {
    return useState({
      email: true,
      push: true,
      sms: false,
      marketing: false,
      alertes: true,
      rapports: true
    });
  }

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
    // Simulation de sauvegarde
    alert("Paramètres sauvegardés avec succès !");
  };

  const handleExportData = () => {
    // Simulation d'export
    alert("Export de vos données en cours...");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (confirmed) {
      alert("Suppression du compte en cours...");
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
    <div className="flex flex-col gap-6 p-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Paramètres</h1>
        <p className="text-gray-500 text-sm">Gérez votre compte et vos préférences</p>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <Input
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <Input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                    <Input
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleInputChange}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                    <Input
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Thème</h4>
                    <p className="text-sm text-gray-500">Choisissez entre clair et sombre</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
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
                    icon={<Settings className="w-4 h-4" />}
                  />
                  
                  <NotificationToggle
                    title="Marketing et promotions"
                    description="Recevez nos offres spéciales"
                    checked={notifications.marketing}
                    onChange={() => handleNotificationChange("marketing")}
                    icon={<Globe className="w-4 h-4" />}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "securite" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Sécurité du compte
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mot de passe actuel</h4>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe actuel"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Nouveau mot de passe</h4>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Confirmer le nouveau mot de passe</h4>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le nouveau mot de passe"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          )}

          {/* Onglet Abonnement */}
          {activeTab === "abonnement" && (
            <div className="space-y-6">
              <AbonnementPage />
            </div>
          )}

          {/* Onglet Données */}
          {activeTab === "donnees" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Gestion des données
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Exporter mes données</h4>
                        <p className="text-sm text-gray-600">Téléchargez toutes vos données au format CSV</p>
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
                  </div>
                  
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Supprimer mon compte</h4>
                        <p className="text-sm text-gray-600">Cette action est irréversible</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </Button>
                    </div>
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

// Composant pour les toggles de notifications
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
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
} 