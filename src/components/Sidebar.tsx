"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Home, Box, BarChart2, Settings, AlertTriangle, Menu as MenuIcon, X as CloseIcon, Crown } from "lucide-react";
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
    { label: "Abonnement", icon: <Crown className="w-5 h-5" />, href: "/abonnement" },
    { label: "Paramètres", icon: <Settings className="w-5 h-5" />, href: "/parametres" },
  ];

  // Fermer le menu mobile après navigation

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { stats } = useData();

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
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 premium-overlay transition-opacity animate-fade-in md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
      {/* Sidebar glassmorphism + dégradé animé */}
      <aside
        ref={drawerRef}
        className={clsx(
          "z-50 flex flex-col min-h-screen premium-sidebar px-2 py-6 space-y-6 transition-all duration-300 ease-in-out rounded-3xl m-2",
          collapsed ? "w-20" : "w-72",
          // Sur mobile : drawer animé
          "fixed md:static",
          mobileOpen ? "left-0 top-0 w-72 h-full animate-slide-in md:left-0" : "-left-80 md:left-0",
          // Sur desktop, fond plus clair et texte foncé
          "md:bg-white/80 md:text-gray-900 md:shadow-xl md:backdrop-blur-md md:border md:border-gray-200"
        )}
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
        tabIndex={-1}
        aria-modal={mobileOpen ? "true" : undefined}
        role={mobileOpen ? "dialog" : undefined}
      >
        {/* Bouton hamburger mobile */}
        <button
          className="absolute top-4 right-4 z-50 bg-white/80 rounded-full p-2 shadow"
          onClick={() => setMobileOpen(false)}
          aria-label="Fermer le menu"
        >
          <CloseIcon className="w-6 h-6 text-gray-700" />
        </button>
        {/* Bouton collapse desktop */}
        <button
          className="hidden md:block absolute -right-3 top-8 bg-white/80 border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 z-10"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? <MenuIcon className="w-4 h-4 text-gray-600" /> : <CloseIcon className="w-4 h-4 text-gray-600" />}
        </button>
        {/* Logo modernisé avec glow néon */}
        <div className="flex items-center justify-center mb-8 px-2">
          <div className="bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center animate-glow-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="white" />
              <text x="50%" y="55%" textAnchor="middle" fill="#a21caf" fontSize="20" fontWeight="bold" dy=".3em" fontFamily="Arial, sans-serif">VP</text>
            </svg>
          </div>
          {!collapsed && <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-tr from-purple-700 to-pink-600 ml-3 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] opacity-95">Vinted Pro</span>}
        </div>
        {/* Navigation avec animation d'apparition */}
        <nav className="flex-1">
          <ul className="space-y-1">
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
        {/* Bouton mode nuit/jour intégré en bas */}
        {!collapsed && (
          <div className="mt-8 flex justify-center">
            <ThemeToggle />
          </div>
        )}
      </aside>
      {/* Bouton hamburger mobile (affiché en dehors du sidebar) */}
      <button
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-tr from-purple-500 to-pink-500 text-white rounded-full p-3 shadow-lg md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <MenuIcon className="w-7 h-7" />
      </button>
    </>
  );
}

function SidebarItem({ icon, label, href, active, badge, badgeColor, collapsed, notification, style, onNavigate }: { icon: React.ReactNode, label: string, href: string, active?: boolean, badge?: string, badgeColor?: string, collapsed?: boolean, notification?: boolean, style?: React.CSSProperties, onNavigate?: () => void }) {
  return (
    <li style={style} className="animate-fade-slide-in">
      <Link
        className={clsx(
          "flex items-center px-3 py-2 rounded-xl font-medium transition relative group shadow-sm premium-menuitem",
          // Desktop : texte foncé, hover doux, fond clair
          "md:text-gray-900 md:hover:bg-purple-100/80 md:hover:text-purple-700 md:focus:bg-purple-100/80 md:focus:text-purple-700",
          // Mobile : premium
          "text-gray-700",
          active && "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl ring-2 ring-pink-300 animate-glow-active",
          collapsed && "justify-center px-2"
        )}
        href={href}
        prefetch={false}
        aria-current={active ? "page" : undefined}
        tabIndex={0}
        onClick={onNavigate}
      >
        <span className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 text-xl",
          active ? "bg-white/20 text-white scale-110 shadow-lg" : "md:bg-white/60 md:text-purple-700 text-purple-500 group-hover:bg-purple-100 group-hover:text-purple-600"
        )}>
          {icon}
          {notification && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full badge-pulse border-2 border-white"></span>
          )}
        </span>
        {!collapsed && <span className="ml-3 flex-1 text-base font-semibold tracking-wide">{label}</span>}
        {badge && !collapsed && (
          <span className={clsx(
            "ml-2 text-xs font-bold px-2 py-0.5 rounded-full badge-pulse",
            badgeColor === "red" ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-700 md:bg-purple-200 md:text-purple-700"
          )}>{badge}</span>
        )}
        {active && <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-400 rounded-r-full shadow-lg animate-glow" />}
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