import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react"

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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
