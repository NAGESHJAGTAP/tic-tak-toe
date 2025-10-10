import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tic Tac Toe',
  description: 'Play Tic Tac Toe online with friends. Challenge players worldwide in this classic game with real-time multiplayer, leaderboards, and game history powered by Next.js and MongoDB.',
  keywords: 'tic tac toe, multiplayer game, online game, board game, strategy game',
  authors: [{ name: 'Tic Tac Toe Game' }],
  openGraph: {
    title: 'Tic Tac Toe Multiplayer | Play Online',
    description: 'Play Tic Tac Toe online with friends in real-time',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
