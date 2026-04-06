import type { Metadata } from 'next'
import './globals.css'
import { PremiumNavigation, PremiumFooter } from '@/components/PremiumNavigation'
import LiveActivity from '@/components/LiveActivity'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zenovee.in'),
  title: {
    default: 'Zenovee — Premium AI Tools for Marketing, Development, SEO & Automation',
    template: '%s | Zenovee',
  },
  description:
    'Premium AI tools for marketing, development, design, SEO & automation. 60+ workflows with credit-based pricing. Get production-ready results in seconds.',
  applicationName: 'Zenovee',
  keywords: [
    'Zenovee',
    'AI tools',
    'AI marketing tools',
    'developer tools',
    'SEO tools',
    'image tools',
    'business automation',
    'SaaS platform',
    'AI workflows',
  ],
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  themeColor: '#000000',
  openGraph: {
    type: 'website',
    url: 'https://www.zenovee.in',
    siteName: 'Zenovee',
    title: 'Zenovee — Premium AI Tools',
    description:
      'Premium AI workflows for marketing, development, design, SEO & automation. 60+ tools with credit-based pricing.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'Zenovee Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenovee — Premium AI Tools',
    description:
      'Premium AI workflows for marketing, development, design, SEO & automation.',
    images: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PremiumNavigation />
        <main className="min-h-screen">
          {children}
        </main>
        <PremiumFooter />
        <LiveActivity />
      </body>
    </html>
  )
}
