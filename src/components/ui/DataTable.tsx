import React from "react";
import { TableSkeleton, EmptyState } from "./Skeleton";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./button";
import { Plus, RefreshCw } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  isLoading: boolean;
  isEmpty: boolean;
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  onRefresh?: () => void;
  onAdd?: () => void;
  className?: string;
}

export function DataTable<T>({
  data,
  isLoading,
  isEmpty,
  columns,
  emptyState,
  onRefresh,
  onAdd,
  className = ""
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isEmpty) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm ${className}`}>
        <EmptyState
          title={emptyState?.title || "Aucune donnée"}
          description={emptyState?.description || "Aucune donnée disponible pour le moment."}
          icon={RefreshCw}
          action={
            emptyState?.action || (
              <div className="flex gap-3">
                {onAdd && (
                  <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                )}
                {onRefresh && (
                  <Button variant="outline" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                )}
              </div>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50/50 transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant pour les cartes de données avec chargement
export function DataCards<T>({
  data,
  isLoading,
  isEmpty,
  renderCard,
  emptyState,
  onRefresh,
  onAdd,
  className = ""
}: {
  data: T[];
  isLoading: boolean;
  isEmpty: boolean;
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  onRefresh?: () => void;
  onAdd?: () => void;
  className?: string;
}) {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-full h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-4" />
            <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md mb-2" />
            <div className="w-1/2 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm ${className}`}>
        <EmptyState
          title={emptyState?.title || "Aucune donnée"}
          description={emptyState?.description || "Aucune donnée disponible pour le moment."}
          icon={RefreshCw}
          action={
            emptyState?.action || (
              <div className="flex gap-3">
                {onAdd && (
                  <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                )}
                {onRefresh && (
                  <Button variant="outline" onClick={onRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                )}
              </div>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {data.map((item, index) => (
        <div
          key={index}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {renderCard(item, index)}
        </div>
      ))}
    </div>
  );
} 