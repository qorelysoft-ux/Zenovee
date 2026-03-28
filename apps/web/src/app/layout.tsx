import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zenovee — Premium AI Workflows for Growth, Dev, SEO, Image, and Ops',
  description:
    'Zenovee turns high-value workflows into premium AI-powered suites for marketing, development, e-commerce image work, SEO growth, and business automation.',
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
              <Link href="/" className="text-lg font-semibold tracking-tight text-white">
                Zenovee
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
              <div>
                <div className="font-semibold text-white">Zenovee</div>
                <div className="mt-1">Premium workflow suites designed to convert time into revenue.</div>
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
