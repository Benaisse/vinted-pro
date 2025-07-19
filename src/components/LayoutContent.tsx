"use client";

import { ReactNode } from 'react';

interface LayoutContentProps {
  children: ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 