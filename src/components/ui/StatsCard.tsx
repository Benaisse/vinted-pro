'use client'

import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion, useAnimation } from "framer-motion";

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
  const colors = colorClasses[color];

  // Animation du compteur
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value as number;
      if (start === end) return;
      let current = start;
      const increment = end / 40;
      const step = () => {
        current += increment;
        if (current < end) {
          setDisplayValue(Math.floor(current));
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };
      step();
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`
      ${colors.bg} ${colors.hover} ${colors.shadow}
      w-full h-36 rounded-2xl flex flex-col justify-center p-6 
        shadow-lg hover:shadow-2xl hover:shadow-black/10
      transition-all duration-300 ease-out cursor-pointer
      min-w-[13rem] max-w-full relative overflow-hidden
      group dark:shadow-gray-900/20
        border border-white/10 hover:border-white/20
      `}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      
      {/* Effet de glow au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center justify-between h-full relative z-10">
        <div className="flex flex-col gap-2 justify-center">
          <span className="text-sm font-medium text-white/90 leading-tight tracking-wide group-hover:text-white transition-colors duration-200">
            {title}
          </span>
          <span className={`text-3xl font-bold ${colors.value} leading-tight group-hover:scale-105 transition-transform duration-200`}>
            {isMounted ? (typeof value === 'number' ? displayValue.toLocaleString() : value) : ''}
          </span>
        </div>
        <div className={`
          p-3 rounded-xl ${colors.icon} 
          flex items-center justify-center
          group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white/30
          transition-all duration-300 ease-out
          shadow-sm group-hover:shadow-md
        `}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: 'w-7 h-7 group-hover:scale-110 transition-transform duration-200' 
          })}
        </div>
      </div>
      <div className="flex items-end justify-between mt-3 relative z-10">
        {subtitle && (
          <div className="text-xs text-white/80 truncate max-w-[10rem] font-medium group-hover:text-white/90 transition-colors duration-200">
            {subtitle}
          </div>
        )}
        {trend && (
          <div className={`
            flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${trend.isPositive 
              ? 'bg-green-500/20 text-green-100 hover:bg-green-500/30' 
              : 'bg-red-500/20 text-red-100 hover:bg-red-500/30'
            }
            group-hover:scale-105 transition-all duration-200
            shadow-sm group-hover:shadow-md
          `}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <TrendingDown className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
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