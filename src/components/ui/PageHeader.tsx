'use client'

import React from 'react'
import { Button } from './button'
import { Plus, Download, Filter } from 'lucide-react'
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string
  description: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'outline' | 'secondary'
  }>
}

export function PageHeader({ title, description, primaryAction, secondaryActions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          {secondaryActions?.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              {primaryAction.icon || <Plus className="w-4 h-4" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
} 