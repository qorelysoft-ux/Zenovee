import type { Metadata } from 'next'
import Link from 'next/link'
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
        <div className="min-h-screen">
          <header className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Zenovee
              </Link>
              <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
                <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white">
                  Tools
                </Link>
                <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">
                  Pricing
                </Link>
                <Link href="/documentation" className="hover:text-zinc-900 dark:hover:text-white">
                  Documentation
                </Link>
                <Link href="/extension" className="hover:text-zinc-900 dark:hover:text-white">
                  Extension
                </Link>
                <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>

          {children}

          <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 text-sm text-zinc-600 dark:text-zinc-300 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Zenovee</div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/documentation" className="hover:text-zinc-900 dark:hover:text-white">
                  Documentation
                </Link>
                <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">
                  Privacy
                </Link>
                <Link href="/extension" className="hover:text-zinc-900 dark:hover:text-white">
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
