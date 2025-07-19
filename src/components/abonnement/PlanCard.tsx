import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PlanCardProps {
  icon: ReactNode;
  title: string;
  price: string;
  priceNote?: string;
  features: { label: string; included: boolean }[];
  isCurrent: boolean;
  isPremium?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  buttonLabel: string;
  badge?: ReactNode;
}

export function PlanCard({
  icon,
  title,
  price,
  priceNote,
  features,
  isCurrent,
  isPremium,
  onClick,
  disabled,
  buttonLabel,
  badge,
}: PlanCardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border ${isPremium ? "border-2 border-indigo-200 shadow-lg" : "border-slate-200 shadow-sm"} p-8 relative overflow-visible hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
    >
      {badge && (
        <div className="absolute -top-6 right-0 z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
          {badge}
        </div>
      )}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 ${isPremium ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-gradient-to-br from-slate-400 to-slate-500"} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">{title}</h2>
        <div className={`text-3xl font-bold ${isPremium ? "text-indigo-600 group-hover:text-indigo-700" : "text-slate-600 group-hover:text-slate-700"} mb-1 transition-colors duration-200`}>{price}</div>
        {priceNote && <div className="text-slate-500 text-sm group-hover:text-slate-600 transition-colors duration-200">{priceNote}</div>}
      </div>
      <div className="space-y-4 mb-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
            {f.included ? (
              <span className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200">✔️</span>
            ) : (
              <span className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform duration-200">❌</span>
            )}
            <span className={f.included ? "text-slate-700 group-hover:text-slate-800 transition-colors duration-200" : "text-slate-400 group-hover:text-slate-500 transition-colors duration-200"}>{f.label}</span>
          </div>
        ))}
      </div>
      <Button
        variant={isPremium ? undefined : "outline"}
        className={`w-full ${isPremium ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"} transition-all duration-200 hover:scale-105`}
        onClick={onClick}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
} 