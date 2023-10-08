import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hush Up!',
  description: 'Where being quiet pays off.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <main className="flex min-h-screen flex-col items-center gap-y-4 p-24 bg-black">
            <h1 className="text-4xl font-semibold text-[#FFD700]">Hush Up!</h1>
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
