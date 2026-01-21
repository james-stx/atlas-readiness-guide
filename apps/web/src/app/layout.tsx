import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Atlas Readiness Guide | U.S. Expansion Readiness Assessment',
  description:
    'A self-serve, AI-guided assessment to evaluate your readiness for U.S. market expansion. Get clarity on what you know vs. what you are assuming.',
  keywords: [
    'US expansion',
    'market readiness',
    'SaaS expansion',
    'go-to-market',
    'B2B SaaS',
    'startup expansion',
  ],
  authors: [{ name: 'STX Labs' }],
  openGraph: {
    title: 'Atlas Readiness Guide',
    description: 'AI-guided U.S. expansion readiness assessment',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
