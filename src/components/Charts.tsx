'use client'

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const data = [
  { name: 'Jan', ventes: 4000, revenus: 2400 },
  { name: 'Fév', ventes: 3000, revenus: 1398 },
  { name: 'Mar', ventes: 2000, revenus: 9800 },
  { name: 'Avr', ventes: 2780, revenus: 3908 },
  { name: 'Mai', ventes: 1890, revenus: 4800 },
  { name: 'Juin', ventes: 2390, revenus: 3800 },
  { name: 'Juil', ventes: 3490, revenus: 4300 },
]

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="ventes" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="revenus" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenus" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
} 