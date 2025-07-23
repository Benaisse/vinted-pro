"use client";
import { ThemeProvider } from "next-themes";
import { DataProvider } from "@/contexts/DataContext";
import { StatsProvider } from "@/contexts/StatsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DataProvider>
        <StatsProvider>
          {children}
        </StatsProvider>
      </DataProvider>
    </ThemeProvider>
  );
} 