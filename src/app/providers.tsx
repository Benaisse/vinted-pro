"use client";
import { ThemeProvider } from "next-themes";
import { DataProvider } from "@/contexts/DataContext";
import { StatsProvider } from "@/contexts/StatsContext";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <DataProvider>
          <StatsProvider>
            {children}
          </StatsProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 