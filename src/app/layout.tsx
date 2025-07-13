import { Providers } from './providers';
import { DataProvider } from '@/contexts/DataContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <DataProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                {children}
              </div>
            </div>
          </DataProvider>
        </Providers>
      </body>
    </html>
  );
} 