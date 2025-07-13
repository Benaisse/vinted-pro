import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  progress,
  className,
  showPercentage = false,
  animated = true,
  color = "blue",
  size = "md"
}: ProgressBarProps) {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    red: "bg-red-600"
  };

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm text-gray-600">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color],
            animated && "animate-pulse"
          )}
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            transition: animated ? "width 0.5s ease-out" : "none"
          }}
        />
      </div>
    </div>
  );
}

// Composant de chargement avec barre de progression
export function LoadingProgress({
  progress,
  title = "Chargement en cours...",
  description,
  className
}: {
  progress: number;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <ProgressBar
          progress={progress}
          showPercentage
          animated
          color="blue"
          size="lg"
        />
      </div>
    </div>
  );
}

// Composant de chargement avec étapes
export function StepProgress({
  steps,
  currentStep,
  className
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                index < currentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === currentStep
                  ? "bg-blue-100 border-blue-600 text-blue-600"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900">
          {steps[currentStep - 1]}
        </p>
      </div>
    </div>
  );
} 