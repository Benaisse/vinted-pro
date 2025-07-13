import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
        sizeClasses[size]
      )} />
      {text && (
        <p className="mt-2 text-sm text-gray-500 animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function ChartLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-80 w-full">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Chargement des données...</p>
      </div>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chargement...</h2>
        <p className="text-gray-500">Préparation de votre tableau de bord</p>
      </div>
    </div>
  );
} 