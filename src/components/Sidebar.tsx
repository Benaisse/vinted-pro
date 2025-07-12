"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Home, Box, BarChart2, Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const menu = [
  { label: "Tableau de bord", icon: <Home className="w-5 h-5" />, href: "/" },
  { label: "Ventes", icon: <ShoppingCart className="w-5 h-5" />, href: "/ventes", badge: "12" },
  { label: "Inventaire", icon: <Box className="w-5 h-5" />, href: "/inventaire" },
  { label: "Stock", icon: <AlertTriangle className="w-5 h-5" />, href: "/stock", badge: "3", badgeColor: "red" },
  { label: "Analytics", icon: <BarChart2 className="w-5 h-5" />, href: "/analytics" },
  { label: "Paramètres", icon: <Settings className="w-5 h-5" />, href: "/parametres" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col w-72 min-h-screen bg-white border-r px-4 py-6 space-y-6">
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg p-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="white" /></svg>
        </div>
        <span className="font-bold text-xl text-gray-900">Vinted Pro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menu.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href || (item.href === "/" && pathname === "/")}
              badge={item.badge}
              badgeColor={item.badgeColor}
            />
          ))}
        </ul>
      </nav>

      {/* Carte d'abonnement */}
      <div className="bg-gray-50 rounded-xl p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">Plan Gratuit</span>
          <span className="text-xs text-gray-400">0€/mois</span>
        </div>
        <div className="flex flex-col space-y-1 mb-2">
          <ProgressBar label="Articles suivis" value={47} max={50} color="green" />
          <ProgressBar label="Ventes ce mois" value={23} max={25} color="orange" />
        </div>
        <div className="bg-orange-50 text-orange-700 text-xs rounded-md px-2 py-1 flex items-center mb-2">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Plus que 3 articles avant la limite gratuite
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 text-white mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm">Premium</span>
            <span className="bg-white/20 rounded px-2 py-0.5 text-xs">-35%</span>
          </div>
          <div className="text-xs mb-2">Illimité | IA avancée</div>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold mr-1">19€</span>
            <span className="text-xs">/mois</span>
          </div>
          <Button className="w-full bg-white text-purple-600 font-semibold hover:bg-purple-50 text-xs py-2">Passer à Premium</Button>
          <div className="text-[10px] text-white/80 mt-1">Essai gratuit 7 jours</div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, href, active, badge, badgeColor }: { icon: React.ReactNode, label: string, href: string, active?: boolean, badge?: string, badgeColor?: string }) {
  return (
    <li>
      <Link
        className={clsx(
          "flex items-center px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition",
          active && "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
        )}
        href={href}
        prefetch={false}
      >
        {icon}
        <span className="ml-3 flex-1">{label}</span>
        {badge && (
          <span className={clsx(
            "ml-2 text-xs font-bold px-2 py-0.5 rounded-full",
            badgeColor === "red" ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
          )}>{badge}</span>
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