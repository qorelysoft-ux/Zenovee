// SimpleNavigation.tsx - Ultra-clean navigation component
"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SimpleNavigation() {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-violet-400 transition-colors">
            Zenovee
          </Link>

          {/* CENTER NAV */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/tools" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/documentation" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Docs
            </Link>
          </div>

          {/* RIGHT SIDE - USER MENU */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Dashboard
            </Link>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Menu
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-slate-900 shadow-lg">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-t-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/checkout"
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    Buy Credits
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-950/20 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
