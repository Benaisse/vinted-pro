import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
    />
  );
}

// Composants skeleton spécialisés
export function MetricCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="w-20 h-8 mb-2" />
      <Skeleton className="w-32 h-3" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="w-48 h-5 mb-2" />
          <Skeleton className="w-64 h-3" />
        </div>
      </div>
      <div className="h-80 w-full">
        <div className="h-full flex items-end justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <Skeleton 
                className="w-full rounded-t-sm mb-2" 
                height={`${Math.random() * 60 + 20}%`}
              />
              <Skeleton className="w-12 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="w-48 h-5 mb-2" />
          <Skeleton className="w-64 h-3" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-32 h-4 mb-1" />
              <Skeleton className="w-24 h-3" />
            </div>
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action 
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action && (
        <div className="animate-fade-in">
          {action}
        </div>
      )}
    </div>
  );
} 