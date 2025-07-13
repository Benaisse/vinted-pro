import { Providers } from "./providers";
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import './globals.css';
// SUPPRIME: import { AnimatePresence } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 