"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Home, Box, BarChart2, Settings, AlertTriangle, Menu as MenuIcon, X as CloseIcon, Crown, Star, TrendingUp, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useData } from "@/contexts/DataContext";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { stats } = useData();

  const menu = [
    { label: "Tableau de bord", icon: <Home className="w-5 h-5" />, href: "/" },
    { label: "Ventes", icon: <ShoppingCart className="w-5 h-5" />, href: "/ventes", badge: stats.totalVentes.toString() },
    { label: "Inventaire", icon: <Box className="w-5 h-5" />, href: "/inventaire" },
    { label: "Stock", icon: <AlertTriangle className="w-5 h-5" />, href: "/stock", badge: (stats.stockFaible + stats.stockRupture).toString(), badgeColor: "red" },
    { label: "Analytics", icon: <BarChart2 className="w-5 h-5" />, href: "/analytics" },
    { label: "Abonnement", icon: <Star className="w-5 h-5" />, href: "/abonnement", badge: "Premium", badgeColor: "yellow" },
    { label: "Paramètres", icon: <Settings className="w-5 h-5" />, href: "/parametres" },
  ];

  // Fermer le menu mobile après navigation
  useEffect(() => {
    if (!mobileOpen) return;
    const handleRoute = () => setMobileOpen(false);
    window.addEventListener("popstate", handleRoute);
    return () => window.removeEventListener("popstate", handleRoute);
  }, [mobileOpen]);

  // Accessibilité : fermeture ESC et clic overlay
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  // Fermeture auto après clic sur un lien
  const handleNav = () => setMobileOpen(false);

  return (
    <>
      {/* Overlay mobile avec effet glassmorphism */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity animate-fade-in md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
      
      {/* Sidebar modernisé avec glassmorphism */}
      <aside
        ref={drawerRef}
        className={clsx(
          "z-50 flex flex-col min-h-screen bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-6 space-y-6 transition-all duration-300 ease-in-out shadow-xl",
          collapsed ? "w-20" : "w-72",
          // Sur mobile : drawer animé
          "fixed md:static",
          mobileOpen ? "left-0 top-0 w-72 h-full animate-slide-in md:left-0" : "-left-80 md:left-0",
          // Design cohérent avec les autres pages
          "md:rounded-2xl md:m-2"
        )}
        tabIndex={-1}
        aria-modal={mobileOpen ? "true" : undefined}
        role={mobileOpen ? "dialog" : undefined}
      >
        {/* Bouton hamburger mobile */}
        <button
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-200 hover:bg-white transition-all duration-200 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        >
          <CloseIcon className="w-5 h-5 text-slate-600" />
        </button>
        
        {/* Bouton collapse desktop */}
        <button
          className="hidden md:block absolute -right-3 top-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 z-10 hover:bg-white"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? <MenuIcon className="w-4 h-4 text-slate-600" /> : <CloseIcon className="w-4 h-4 text-slate-600" />}
        </button>
        
        {/* Logo modernisé */}
        <div className="flex items-center justify-center mb-8 px-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3 shadow-lg flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="white" />
              <text x="50%" y="55%" textAnchor="middle" fill="#6366f1" fontSize="20" fontWeight="bold" dy=".3em" fontFamily="Arial, sans-serif">VP</text>
            </svg>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-slate-800 ml-3 tracking-wide">
              Vinted Pro
            </span>
          )}
        </div>
        
        {/* Navigation modernisée */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menu.map((item, idx) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href || (item.href === "/" && pathname === "/")}
                badge={item.badge}
                badgeColor={item.badgeColor}
                collapsed={collapsed}
                notification={item.label === "Ventes"}
                style={{ animationDelay: `${0.05 * idx + 0.1}s` }}
                onNavigate={handleNav}
              />
            ))}
          </ul>
        </nav>
        
        {/* Section statistiques rapides */}
        {!collapsed && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Ventes du jour</span>
                <span className="font-semibold text-slate-800">{stats.totalVentes}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Stock faible</span>
                <span className="font-semibold text-red-600">{stats.stockFaible}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Bouton mode nuit/jour intégré en bas */}
        {!collapsed && (
          <div className="mt-6 flex justify-center">
            <ThemeToggle />
          </div>
        )}
      </aside>
      
      {/* Bouton hamburger mobile */}
      <button
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
    </>
  );
}

function SidebarItem({ icon, label, href, active, badge, badgeColor, collapsed, notification, style, onNavigate }: { 
  icon: React.ReactNode, 
  label: string, 
  href: string, 
  active?: boolean, 
  badge?: string, 
  badgeColor?: string, 
  collapsed?: boolean, 
  notification?: boolean, 
  style?: React.CSSProperties, 
  onNavigate?: () => void 
}) {
  return (
    <li style={style} className="animate-fade-slide-in">
      <Link
        className={clsx(
          "flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 relative group",
          "text-slate-700 hover:text-slate-900",
          "hover:bg-white/60 hover:shadow-md",
          active && "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg",
          collapsed && "justify-center px-2"
        )}
        href={href}
        prefetch={false}
        aria-current={active ? "page" : undefined}
        tabIndex={0}
        onClick={onNavigate}
      >
        <span className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
          active 
            ? "bg-white/20 text-white" 
            : "text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-50"
        )}>
          {icon}
          {notification && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          )}
        </span>
        
        {!collapsed && (
          <span className="ml-3 flex-1 text-sm font-medium">
            {label}
          </span>
        )}
        
        {badge && !collapsed && (
          <span className={clsx(
            "ml-2 text-xs font-bold px-2 py-0.5 rounded-full",
            badgeColor === "red" 
              ? "bg-red-100 text-red-600" 
              : badgeColor === "yellow"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-indigo-100 text-indigo-700"
          )}>
            {badge}
          </span>
        )}
        
        {active && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
        )}
      </Link>
    </li>
  );
}

function ProgressBar({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
  const percent = Math.round((value / max) * 100);
  const barColor = color === "green" ? "bg-green-500" : color === "orange" ? "bg-orange-500" : "bg-gray-300";
  return (
    <div className="mb-1">
      <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className={clsx("h-2 rounded-full", barColor)} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
} 