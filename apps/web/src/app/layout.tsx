import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zenovee — Paid Halal Multi-Tools SaaS',
  description:
    'Zenovee is a paid-only productivity platform with 50 practical tools across AI, Developer, Image, SEO, Text, and Utilities.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  )
}
