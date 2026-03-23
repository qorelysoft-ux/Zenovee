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
          {children}

          <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 text-sm text-zinc-600 dark:text-zinc-300 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Zenovee</div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
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
