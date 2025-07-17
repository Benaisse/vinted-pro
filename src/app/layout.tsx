"use client";
import { Providers } from "./providers";
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import './globals.css';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function RootLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login' || pathname === '/register';

  return (
    <html lang="fr">
      <body>
        <Providers>
          {hideSidebar ? (
            children
          ) : (
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                {children}
              </div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
} 