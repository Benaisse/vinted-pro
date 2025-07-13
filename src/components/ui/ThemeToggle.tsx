'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 group"
      aria-label={`Basculer vers le mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      <div className="relative w-5 h-5">
        {/* Icône Soleil */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'text-yellow-500 rotate-0 scale-100' 
              : 'text-gray-400 -rotate-90 scale-0'
          }`}
        />
        {/* Icône Lune */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'text-blue-400 rotate-0 scale-100' 
              : 'text-gray-400 rotate-90 scale-0'
          }`}
        />
      </div>
      {/* Effet de glow */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-yellow-100/50 scale-0 group-hover:scale-100' 
          : 'bg-blue-100/50 scale-0 group-hover:scale-100'
      }`} />
    </Button>
  )
} 