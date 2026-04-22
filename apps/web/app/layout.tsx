import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import AuthHeader from '../components/AuthHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realtime Weather Dashboard',
  description: 'A multi-service weather monitoring system with live updates.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/75 px-5 py-4 backdrop-blur md:px-8">
            <span className="text-sm uppercase tracking-[0.22em] text-emerald-800">
              Weather Dashboard
            </span>
            <AuthHeader />
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
