"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'
import { apiFetch } from '@/lib/api'

type UserInfo = {
  email?: string
}

type UsageRow = {
  id: string
  creditsUsed: number
  tool: {
    slug: string
    name: string
    category: string
  }
  createdAt: string
}

type UsageSummary = {
  recentUsage: UsageRow[]
}

const navigationItems = [
  { label: 'Dashboard', href: '#', icon: '📊' },
  { label: 'Marketing Tools', href: '/tools/marketing', icon: '📈' },
  { label: 'Developer Tools', href: '/tools/dev-assistant', icon: '⚙️' },
  { label: 'Image Tools', href: '/tools/ecom-image', icon: '🎨' },
  { label: 'SEO Tools', href: '/tools/seo-growth', icon: '🔍' },
  { label: 'Automation Tools', href: '/tools/business-automation', icon: '🤖' },
  { label: 'Billing', href: '/checkout', icon: '💳' },
]

const recommendedTools = [
  { name: 'Ad Copy Conversion Engine', icon: '📝', category: 'MARKETING' },
  { name: 'Code Documentation Generator', icon: '📚', category: 'DEV_ASSISTANT' },
  { name: 'Bulk Background Removal', icon: '🖼️', category: 'ECOM_IMAGE' },
  { name: 'SEO Authority Builder', icon: '📖', category: 'MARKETING' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [creditBalance, setCreditBalance] = useState(0)
  const [recentUsage, setRecentUsage] = useState<UsageRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      if (!data.user) {
        router.replace('/login')
        return
      }
      setUser({ email: data.user.email ?? undefined })
      try {
        const resp = await apiFetch<{ ok: true; balance: number; usage: UsageSummary }>('/me/entitlements')
        if (!mounted) return
        setCreditBalance(resp.balance)
        setRecentUsage(resp.usage.recentUsage.slice(0, 5))
      } catch (e) {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Failed to load dashboard')
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-300">Loading your dashboard…</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 bg-slate-900 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Zenovee</h2>
          <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-8 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {/* TOP SECTION */}
        <div className="border-b border-white/10 bg-slate-900/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="mt-1 text-slate-400">Welcome back! Here's your workspace overview.</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* CREDIT CARD */}
          <div className="mb-8 rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-950/40 to-white/5 p-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-400">Your Credit Balance</p>
                <h2 className="mt-2 text-5xl font-bold text-white">{creditBalance.toLocaleString()}</h2>
                <p className="mt-2 text-sm text-slate-400">Credits available for tools</p>
              </div>
              <Link
                href="/checkout"
                className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold text-white hover:scale-105 transition-transform"
              >
                Buy More Credits
              </Link>
            </div>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* RECENTLY USED TOOLS */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Recently Used Tools</h3>
              {recentUsage.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {recentUsage.map((usage) => (
                    <div key={usage.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-medium text-white">{usage.tool.name}</p>
                        <p className="text-xs text-slate-400">{new Date(usage.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-violet-400">{usage.creditsUsed} credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">No tools used yet. Start by exploring a category.</p>
              )}
            </div>

            {/* RECOMMENDED TOOLS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">Recommended</h3>
              <div className="mt-4 space-y-2">
                {recommendedTools.map((tool) => (
                  <button
                    key={tool.name}
                    className="w-full rounded-lg bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span className="mr-2">{tool.icon}</span>
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK START */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Quick Start</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {navigationItems.slice(1, 5).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 text-center font-medium text-white hover:border-violet-400/50 hover:bg-white/10 transition-colors"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="mt-2 text-sm">{item.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
