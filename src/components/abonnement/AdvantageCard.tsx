import { ReactNode } from "react";

interface AdvantageCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bgClass?: string;
  borderClass?: string;
}

export function AdvantageCard({ icon, title, description, bgClass = '', borderClass = '' }: AdvantageCardProps) {
  return (
    <div className={`text-center p-6 rounded-xl ${bgClass} ${borderClass} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group`}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-200">{title}</h3>
      <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-200">{description}</p>
    </div>
  );
} 