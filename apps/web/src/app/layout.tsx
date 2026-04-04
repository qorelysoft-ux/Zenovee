import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zenovee.in'),
  title: {
    default: 'Zenovee — AI Tools, Developer Tools, SEO Tools, Image Tools & Utilities',
    template: '%s | Zenovee',
  },
  description:
    'Zenovee is a SaaS tools platform for AI workflows, developer utilities, SEO tools, image tools, and business automation. Use free launch tools now and explore upcoming premium tools.',
  applicationName: 'Zenovee',
  keywords: [
    'Zenovee',
    'AI tools',
    'developer tools',
    'SEO tools',
    'image tools',
    'business automation tools',
    'online productivity tools',
    'SaaS tools platform',
  ],
  alternates: {
    canonical: 'https://www.zenovee.in',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.zenovee.in',
    siteName: 'Zenovee',
    title: 'Zenovee — AI Tools, Developer Tools, SEO Tools, Image Tools & Utilities',
    description:
      'Zenovee is a SaaS tools platform for AI workflows, developer utilities, SEO tools, image tools, and business automation.',
    images: [
      {
        url: '/logo.svg',
        width: 1024,
        height: 1024,
        alt: 'Zenovee Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenovee — AI Tools, Developer Tools, SEO Tools, Image Tools & Utilities',
    description:
      'Use Zenovee for AI workflows, developer utilities, SEO tools, image tools, and business automation.',
    image: '/logo.svg',
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
        <div className="zen-shell min-h-screen">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Zenovee Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-lg font-semibold tracking-tight text-white">Zenovee</span>
              </Link>
              <nav className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
                <Link href="/tools" className="hover:text-white">
                  Tools
                </Link>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
                <Link href="/documentation" className="hover:text-white">
                  Documentation
                </Link>
                <Link href="/extension" className="hover:text-white">
                  Extension
                </Link>
                <Link href="/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-white hover:border-white/30 hover:bg-white/5">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>

          {children}

          <footer className="border-t border-white/10 py-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Zenovee Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <div>
                  <div className="font-semibold text-white">Zenovee</div>
                  <div className="mt-1">Premium workflow suites designed to convert time into revenue.</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/documentation" className="hover:text-white">
                  Documentation
                </Link>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
                <Link href="/extension" className="hover:text-white">
                  Chrome Extension Install
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
