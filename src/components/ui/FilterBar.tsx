'use client'

import React from 'react'
import { Input } from './input'
import { Button } from './button'
import { Search, Filter, X, Grid3X3, List } from 'lucide-react'
import { motion } from "framer-motion";

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    key: string
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }>
  onClearFilters?: () => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  showViewToggle?: boolean
}

export function FilterBar({
  searchPlaceholder = "Rechercher...",
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  viewMode,
  onViewModeChange,
  showViewToggle = false
}: FilterBarProps) {
  const hasActiveFilters = searchValue || filters.some(f => f.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Recherche */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 hover:scale-105 hover:shadow-md"
          />
        </div>
        {/* Filtres */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <div key={filter.key} className="relative">
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white text-sm transition-all duration-200 hover:border-gray-300 appearance-none pr-8 hover:scale-105 hover:shadow-md"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          ))}
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3">
          {showViewToggle && viewMode && onViewModeChange && (
            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105 hover:shadow-md'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105 hover:shadow-md'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
} 