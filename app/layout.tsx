import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Election Derby',
  description: 'Upper-house seat prediction game',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
