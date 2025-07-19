"use client"

import {
  Bell,
  Search,
  Settings,
  TrendingUp,
  MessageCircle,
  ShoppingCart,
  Bot,
  Trash2,
  Box,
  Sparkles,
  Zap,
  Activity,
  Plus,
  ChevronDown,
  Filter,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useRef, useEffect, useCallback } from "react";
import { ArticleFormModal } from "@/components/ArticleFormModal";
import { AIAssistant } from "@/components/AIAssistant";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { ImportVintedButton } from "./import/ImportVintedButton";
import { 
  Notification, 
  NotificationFilter, 
  ModernNotificationItemProps,
  ColorClasses 
} from "@/types/header";

interface HeaderProps {
  showNotifications?: boolean;
  showMessages?: boolean;
  showQuickActions?: boolean;
}

// Composant pour afficher une notification moderne avec types stricts
function ModernNotificationItem({ notif, onMarkAsRead, onDelete }: ModernNotificationItemProps) {
  const getIcon = () => {
    switch (notif.type) {
      case 'vente': return <ShoppingCart className="h-4 w-4" />;
      case 'stock': return <Box className="h-4 w-4" />;
      case 'engagement': return <Activity className="h-4 w-4" />;
      case 'ia': return <Bot className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getColorClasses = (): ColorClasses => {
    switch (notif.color) {
      case 'green': return {
        border: 'border-l-emerald-400',
        bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
        icon: 'bg-emerald-100 text-emerald-600',
        title: 'text-emerald-900',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700'
      };
      case 'orange': return {
        border: 'border-l-amber-400',
        bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
        icon: 'bg-amber-100 text-amber-600',
        title: 'text-amber-900',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700'
      };
      case 'blue': return {
        border: 'border-l-blue-400',
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        icon: 'bg-blue-100 text-blue-600',
        title: 'text-blue-900',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700'
      };
      case 'purple': return {
        border: 'border-l-purple-400',
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        icon: 'bg-purple-100 text-purple-600',
        title: 'text-purple-900',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700'
      };
      default: return {
        border: 'border-l-gray-400',
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        icon: 'bg-gray-100 text-gray-600',
        title: 'text-gray-900',
        text: 'text-gray-700',
        badge: 'bg-gray-100 text-gray-700'
      };
    }
  };

  const colors = getColorClasses();

  return (
    <div 
      className={`group relative p-4 ${colors.bg} ${colors.border} border-l-4 rounded-r-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          notif.action?.onClick();
        }
      }}
      aria-label={`Notification: ${notif.titre} - ${notif.message}`}
    >
      {!notif.lue && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true"></div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className={`p-2.5 rounded-xl ${colors.icon} shadow-sm`} aria-hidden="true">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold text-sm ${colors.title}`}>
              {notif.titre}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>
              {notif.statut}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed ${colors.text} mb-3`}>
            {notif.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                {notif.date.toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {notif.montant && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {notif.montant}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {notif.action && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-xs h-7 px-3 hover:bg-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    notif.action?.onClick();
                  }}
                  aria-label={notif.action.label}
                >
                  {notif.action.label}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notif.id);
                }}
                aria-label="Supprimer la notification"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ 
  showNotifications = true,
  showMessages = true,
  showQuickActions = true 
}: HeaderProps = {}) {
  // États du composant
  const [search, setSearch] = useState("");
  const [msgCount, setMsgCount] = useState(2);
  const [online, setOnline] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [filtreNotif, setFiltreNotif] = useState<'toutes' | 'ventes' | 'ia' | 'stock'>('toutes');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const router = useRouter();
  const { addArticle, stats } = useData();
  const { signOut, user } = useAuth();
  
  // État des notifications avec types stricts
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "vente",
      titre: "💰 Nouvelle vente",
      message: "Jean Levi's vendu pour 35€ à Thomas M.",
      lue: false,
      date: new Date(Date.now() - 15 * 60 * 1000),
      statut: "Succès",
      montant: "+28€ net",
      action: { label: "Voir détails", onClick: () => router.push("/ventes") },
      color: "green",
    },
    {
      id: 2,
      type: "stock",
      titre: "📦 Stock faible",
      message: "Plus que 2 articles en stock dans la catégorie Chaussures",
      lue: false,
      date: new Date(Date.now() - 60 * 60 * 1000),
      statut: "Attention",
      action: { label: "Réapprovisionner", onClick: () => router.push("/stock") },
      color: "orange",
    },
    {
      id: 3,
      type: "engagement",
      titre: "❤️ Nouvel engagement",
      message: "Votre sac Longchamp a reçu 5 nouveaux favoris",
      lue: true,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      statut: "Info",
      action: { label: "Voir l'article", onClick: () => router.push("/inventaire") },
      color: "blue",
    },
    {
      id: 4,
      type: "ia",
      titre: "🤖 Analyse IA terminée",
      message: "L'analyse de vos photos a détecté 3 améliorations possibles",
      lue: false,
      date: new Date(Date.now() - 30 * 60 * 1000),
      statut: "IA",
      action: { label: "Voir l'analyse", onClick: () => router.push("/ai-analytics") },
      color: "purple",
    },
  ]);

  // Effects
  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  // Fonctions calculées avec useCallback pour optimiser les performances
  const notifCount = notifications.filter((n: Notification) => !n.lue).length;
  
  const filteredNotifications = useCallback(() => {
    return notifications.filter((n: Notification) => {
      if (filtreNotif === 'toutes') return true;
      if (filtreNotif === 'ventes') return n.type === 'vente';
      if (filtreNotif === 'ia') return n.type === 'ia';
      if (filtreNotif === 'stock') return n.type === 'stock';
      return true;
    });
  }, [notifications, filtreNotif]);

  // Fonctions de gestion
  const markAllAsRead = useCallback(() => {
    setNotifications(notifs => notifs.map((n: Notification) =>
      (filtreNotif === 'toutes' ||
       (filtreNotif === 'ventes' && n.type === 'vente') ||
       (filtreNotif === 'ia' && n.type === 'ia') ||
       (filtreNotif === 'stock' && n.type === 'stock'))
        ? { ...n, lue: true } : n
    ));
  }, [filtreNotif]);
  
  const deleteNotif = useCallback((id: number) => {
    setNotifications(notifs => notifs.filter((n: Notification) => n.id !== id));
  }, []);
  
  const markAsRead = useCallback((id: number) => {
    setNotifications(notifs => notifs.map((n: Notification) => n.id === id ? { ...n, lue: true } : n));
  }, []);

  const handleLogout = useCallback(() => {
    signOut();
    router.push('/login');
  }, [signOut, router]);

  const getInitials = useCallback(() => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }, [user?.name]);

  const handleAddArticle = useCallback((articleData: any) => {
    addArticle(articleData);
    setModalOpen(false);
  }, [addArticle]);

  // Vérification de montage
  if (!isMounted) return null;

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 h-20 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-50">
      {/* Section gauche */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        {/* Barre de recherche moderne */}
        <div className={`relative flex-1 max-w-lg group transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ${searchFocused ? 'text-purple-600 scale-110' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Rechercher un article, acheteur..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-all duration-300 hover:shadow-xl"
              aria-label="Recherche dans l'application"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              ref={inputRef}
            />
          </div>
        </div>
        
        {/* Indicateur de statut moderne */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg"></div>
              <span className="text-sm font-semibold text-emerald-700">En ligne</span>
            </div>
            <div className="h-4 w-px bg-emerald-200"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">+{stats.totalVentes || 0} ventes aujourd'hui</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section droite */}
      <div className="flex items-center gap-3">
        {/* Actions rapides avec effets modernes */}
        {showQuickActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              onClick={() => setModalOpen(true)}
              aria-label="Ajouter un article"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              asChild
              aria-label="Importer des données Vinted"
            >
              <ImportVintedButton />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              onClick={() => router.push('/stock')}
              aria-label="Gérer le stock"
            >
              <Box className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              onClick={() => setAiAssistantOpen(true)}
              aria-label="Assistant IA"
            >
              <Bot className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              onClick={() => router.push('/analytics')}
              aria-label="Voir les analytics"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="h-6 w-px bg-gray-200"></div>
        
        {/* Notifications modernes */}
        {showNotifications && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
                aria-label={`Notifications (${notifCount} non lues)`}
              >
                <Bell className="w-4 h-4" />
                {notifCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {notifCount}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[420px] p-0 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 hover:bg-gray-100"
                      onClick={markAllAsRead}
                      aria-label="Marquer toutes les notifications comme lues"
                    >
                      Tout marquer comme lu
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Filtrer les notifications">
                      <Filter className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Filtres */}
                <div className="flex gap-2">
                  {(['toutes', 'ventes', 'stock', 'ia'] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={filtreNotif === filter ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs h-7 transition-all duration-200 ${
                        filtreNotif === filter 
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setFiltreNotif(filter)}
                      aria-label={`Filtrer par ${filter}`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredNotifications().length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredNotifications().map(notif => (
                      <ModernNotificationItem 
                        key={notif.id} 
                        notif={notif} 
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotif}
                      />
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Messages */}
        {showMessages && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                aria-label={`Messages (${msgCount} non lus)`}
              >
                <MessageCircle className="w-4 h-4" />
                {msgCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {msgCount}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-4">Messages</h3>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun message</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Paramètres */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-all duration-300 hover:scale-110"
              aria-label="Paramètres"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <DropdownMenuLabel className="text-gray-900">Paramètres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => router.push('/parametres')}
              className="hover:bg-gray-50"
            >
              Préférences
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-red-50 text-red-600"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Avatar utilisateur moderne */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm">{getInitials()}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
            <DropdownMenuLabel className="text-gray-900">
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getInitials()}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => router.push('/profil')}
              className="hover:bg-purple-50"
            >
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-red-50 text-red-600"
            >
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Modals */}
      <ArticleFormModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleAddArticle} 
      />
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)} 
      />
    </header>
  );
}