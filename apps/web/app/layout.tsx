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
        <body>
          <header className="site-header">
            <span className="site-header__logo">Weather Dashboard</span>
            <AuthHeader />
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
