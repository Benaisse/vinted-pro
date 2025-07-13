"use client"

import {
  Bell,
  Search,
  User,
  Settings,
  Package,
  TrendingUp,
  MessageCircle,
  Heart,
  Brain,
  ShoppingCart,
  Crown,
  LogOut,
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
import { useState, useRef, useEffect } from "react";
import { ArticleFormModal } from "@/components/ArticleFormModal";
import { useRouter } from "next/navigation";
import { useData } from "@/contexts/DataContext";

export function Header() {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount, setMsgCount] = useState(2);
  const [online, setOnline] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { addArticle, stats } = useData();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  // Utiliser la vraie fonction d'ajout d'article du contexte
  const handleAddArticle = (article: any) => {
    addArticle(article);
    console.log("Article ajouté avec succès:", article);
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-2 sm:px-6">
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
        <div className="relative max-w-md w-full group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
          <Input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un article, acheteur..."
            className="pl-10 pr-10 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            aria-label="Recherche"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => { setSearch(""); inputRef.current?.focus(); }}
              aria-label="Effacer la recherche"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-6">
        {/* Statut en ligne + ventes */}
        <div className="flex items-center space-x-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border shadow-sm cursor-pointer group" tabIndex={0} title="Statut et ventes du jour">
          <div className="flex items-center space-x-1">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-lg border-2 border-white" style={{background: online ? "#a21caf" : "#d1d5db"}}></div>
            <span className="text-xs font-medium text-purple-700">{online ? "En ligne" : "Hors ligne"}</span>
          </div>
          <span className="hidden sm:inline mx-1 text-gray-300">|</span>
          <div className="text-xs text-gray-700 flex items-center gap-1">
            <span className="font-bold text-green-600 animate-bounce-slow">+{stats.totalVentes}</span>
            <span className="hidden sm:inline">ventes aujourd'hui</span>
          </div>
        </div>
        {/* Actions rapides */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" className="relative group" aria-label="Ajouter un article (Ctrl+N)" onClick={() => setModalOpen(true)}>
            <Package className="h-5 w-5" />
            <span className="sr-only">Ajouter</span>
            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Ajouter un article (Ctrl+N)
            </div>
          </Button>
          <Button variant="ghost" size="icon" className="relative group" aria-label="Voir les analytics (Ctrl+A)">
            <TrendingUp className="h-5 w-5" />
            <span className="sr-only">Analytics</span>
            <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Voir les analytics (Ctrl+A)
            </div>
          </Button>
        </div>
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group" aria-label="Notifications">
              <div className="relative">
                <Bell className="h-5 w-5 transition-all duration-200 group-hover:scale-110" />
                {notifCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifCount}
                    </div>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
            {/* Header des notifications */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
                <p className="text-xs text-gray-500">3 nouvelles notifications</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  Tout marquer lu
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Paramètres
                </Button>
              </div>
            </div>

            {/* Filtres de notifications */}
            <div className="flex items-center space-x-2 p-3 border-b bg-gray-50">
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                Toutes
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Ventes
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                IA
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Stock
              </Button>
            </div>

            <DropdownMenuSeparator />

            {/* Notifications avec types et priorités */}
            <div className="max-h-64 overflow-y-auto">
              {/* Notification IA urgente */}
              <DropdownMenuItem className="p-4 border-l-4 border-l-red-500 bg-red-50 hover:bg-red-100">
                <div className="flex items-start space-x-3 w-full">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Brain className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-red-800">🤖 Alerte IA Critique</p>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600">Urgent</span>
                      </div>
                    </div>
                    <p className="text-xs text-red-700 mb-2">
                      Votre robe Zara pourrait se vendre 25% plus cher selon les tendances actuelles
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-600">Il y a 5 min</span>
                      <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                        Ajuster le prix
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Notification de vente */}
              <DropdownMenuItem className="p-4 border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100">
                <div className="flex items-start space-x-3 w-full">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-green-800">💰 Nouvelle vente</p>
                      <span className="text-xs text-green-600">Succès</span>
                    </div>
                    <p className="text-xs text-green-700 mb-2">Jean Levi's vendu pour 35€ à Thomas M.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">Il y a 15 min</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-green-800">+28€ net</span>
                        <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Notification de stock */}
              <DropdownMenuItem className="p-4 border-l-4 border-l-orange-500 bg-orange-50 hover:bg-orange-100">
                <div className="flex items-start space-x-3 w-full">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-orange-800">📦 Stock faible</p>
                      <span className="text-xs text-orange-600">Attention</span>
                    </div>
                    <p className="text-xs text-orange-700 mb-2">
                      Plus que 2 articles en stock dans la catégorie Chaussures
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-orange-600">Il y a 1h</span>
                      <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                        Réapprovisionner
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>

              {/* Notification d'engagement */}
              <DropdownMenuItem className="p-4 border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100">
                <div className="flex items-start space-x-3 w-full">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-blue-800">❤️ Nouvel engagement</p>
                      <span className="text-xs text-blue-600">Info</span>
                    </div>
                    <p className="text-xs text-blue-700 mb-2">Votre sac Longchamp a reçu 5 nouveaux favoris</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">Il y a 2h</span>
                      <Button size="sm" variant="outline" className="text-xs h-6 bg-transparent">
                        Voir l'article
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>

            {/* Footer des notifications */}
            <div className="p-3 border-t bg-gray-50">
              <Button variant="ghost" className="w-full text-sm">
                Voir toutes les notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Messages */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group" aria-label="Messages">
              <MessageCircle className="h-5 w-5 transition-all duration-200 group-hover:scale-110" />
              {msgCount > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {msgCount}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>ML</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Marie L.</p>
                  <p className="text-xs text-gray-500">Question sur la robe Zara...</p>
                  <span className="text-xs text-gray-400">Il y a 10 min</span>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Paramètres */}
        <Button variant="ghost" size="icon" className="group" aria-label="Paramètres" onClick={() => router.push("/parametres")}>
          <Settings className="h-5 w-5" />
        </Button>
        {/* Profil utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative focus:outline-none group" aria-label="Profil utilisateur">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar utilisateur" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Profil utilisateur */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-500">john.doe@email.com</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600 font-medium">Plan Gratuit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="p-3 border-b bg-gray-50">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{stats.totalVentes}</p>
                  <p className="text-xs text-gray-500">Ventes</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">{stats.totalRevenus.toLocaleString()}€</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{stats.totalArticles}</p>
                  <p className="text-xs text-gray-500">Articles</p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Crown className="mr-2 h-4 w-4" />
              Passer à Premium
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Modal d'ajout d'article */}
      <ArticleFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddArticle} />
    </header>
  );
} 