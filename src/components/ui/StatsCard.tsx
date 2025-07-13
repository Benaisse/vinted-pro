'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    icon: 'bg-blue-600/20 text-blue-600',
    value: 'text-white',
    hover: 'hover:from-blue-600 hover:to-blue-700',
    shadow: 'shadow-blue-500/25'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    icon: 'bg-green-600/20 text-green-600',
    value: 'text-white',
    hover: 'hover:from-green-600 hover:to-green-700',
    shadow: 'shadow-green-500/25'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    icon: 'bg-purple-600/20 text-purple-600',
    value: 'text-white',
    hover: 'hover:from-purple-600 hover:to-purple-700',
    shadow: 'shadow-purple-500/25'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    icon: 'bg-orange-600/20 text-orange-600',
    value: 'text-white',
    hover: 'hover:from-orange-600 hover:to-orange-700',
    shadow: 'shadow-orange-500/25'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-500 to-red-600',
    icon: 'bg-red-600/20 text-red-600',
    value: 'text-white',
    hover: 'hover:from-red-600 hover:to-red-700',
    shadow: 'shadow-red-500/25'
  }
}

export function StatsCard({ title, value, subtitle, icon, color, trend }: StatsCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  const colors = colorClasses[color]
  return (
    <div className={`
      ${colors.bg} ${colors.hover} ${colors.shadow}
      w-full h-36 rounded-2xl flex flex-col justify-center p-6 
      shadow-lg hover:shadow-2xl hover:scale-105 
      transition-all duration-300 ease-out cursor-pointer
      min-w-[13rem] max-w-full relative overflow-hidden
      group dark:shadow-gray-900/20
    `}>
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      
      <div className="flex items-center justify-between h-full relative z-10">
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-sm font-medium text-white/90 leading-tight tracking-wide">
            {title}
          </span>
          <span className={`text-3xl font-bold ${colors.value} leading-tight`}>
            {isMounted ? (typeof value === 'number' ? value.toLocaleString() : value) : ''}
          </span>
        </div>
        <div className={`
          p-3 rounded-xl ${colors.icon} 
          flex items-center justify-center
          group-hover:scale-110 group-hover:rotate-3
          transition-all duration-300 ease-out
        `}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: 'w-7 h-7' 
          })}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-3 relative z-10">
        {subtitle && (
          <div className="text-xs text-white/80 truncate max-w-[10rem] font-medium">
            {subtitle}
          </div>
        )}
        {trend && (
          <div className={`
            flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${trend.isPositive 
              ? 'bg-green-500/20 text-green-100' 
              : 'bg-red-500/20 text-red-100'
            }
            group-hover:scale-105 transition-transform duration-200
          `}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  )
} 

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-4 shadow flex flex-col gap-2 min-w-[180px] min-h-[110px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded mt-4" />
    </div>
  );
} 