import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy Discover — Crush Matching & Discovery',
  description: 'Mobile-first swipe-based discovery feature for Coy with zero-leak privacy and SQLite backend.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen p-0 md:p-4">
        {children}
      </body>
    </html>
  );
}
