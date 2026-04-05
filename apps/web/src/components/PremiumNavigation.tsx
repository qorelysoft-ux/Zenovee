'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function PremiumNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <span className="text-lg font-bold text-white">Z</span>
            </div>
            <span className="hidden text-lg font-bold text-white sm:inline">Zenovee</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/tools" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/documentation" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/extension" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Extension
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="btn-secondary text-sm px-4 py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/tools"
              className="btn-premium text-sm px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/tools" className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
              Tools
            </Link>
            <Link href="/pricing" className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/documentation" className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
              Docs
            </Link>
            <Link href="/extension" className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
              Extension
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:text-white">
              Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export function PremiumFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <span className="text-lg font-bold text-white">Z</span>
              </div>
              <span className="font-bold text-white">Zenovee</span>
            </div>
            <p className="text-sm text-slate-400">
              Premium workflow suites designed to convert time and effort into revenue.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/extension" className="hover:text-white transition-colors">
                  Chrome Extension
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Updates</h3>
            <p className="text-sm text-slate-400 mb-4">
              Get notified about new tools and features.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none"
              />
              <button className="bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 rounded-r-lg text-sm font-semibold text-white hover:opacity-90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
          <p>&copy; 2024 Zenovee. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
