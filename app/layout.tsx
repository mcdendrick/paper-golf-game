import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paper Golf',
  description: 'A fun paper golf game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
