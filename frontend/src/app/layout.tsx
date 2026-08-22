import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FitTracker - Your Personal Fitness Companion',
  description: 'Track workouts, monitor progress, and achieve your fitness goals with animated progress rings and beautiful charts.',
  keywords: ['fitness', 'workout', 'tracker', 'health', 'exercise', 'gym'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-dark-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}