"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { apiFetch } from '@/lib/api'

type DashboardStats = {
  totals: {
    totalRevenueUsd: number
    totalAiCostUsd: number
    totalProfitUsd: number
    activeUsers: number
  }
  toolPerformance: Array<{
    name: string
    runs: number
    profitUsd: number
  }>
  recentUsers: Array<{
    email: string
    spendUsd: number
    createdAt: string
  }>
  topUsers: Array<{
    email: string
    spendUsd: number
    runs: number
  }>
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      if (!data.user) {
        router.replace('/login')
        return
      }

      try {
        // Try to fetch admin stats - if it fails, user is not admin
        const response = await apiFetch<DashboardStats>('/admin/dashboard-stats')
        if (!mounted) return
        setStats(response)
      } catch (e) {
        if (!mounted) return
        setError('Admin access required')
        router.replace('/dashboard')
        return
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-slate-300">Loading admin dashboard…</div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-400">Access denied. Admin only.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-slate-400">Platform metrics and performance overview</p>
        </div>

        {/* TOP 4 CARDS */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Total Revenue</p>
            <h2 className="mt-3 text-3xl font-bold text-white">${stats.totals.totalRevenueUsd.toFixed(2)}</h2>
            <p className="mt-2 text-xs text-slate-500">All time earned</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">AI Cost</p>
            <h2 className="mt-3 text-3xl font-bold text-white">${stats.totals.totalAiCostUsd.toFixed(2)}</h2>
            <p className="mt-2 text-xs text-slate-500">Total API costs</p>
          </div>

          <div className="rounded-2xl border border-violet-400/30 bg-violet-950/20 p-6">
            <p className="text-sm text-violet-400">Profit</p>
            <h2 className="mt-3 text-3xl font-bold text-violet-300">${stats.totals.totalProfitUsd.toFixed(2)}</h2>
            <p className="mt-2 text-xs text-violet-400/60">Net profit</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Active Users</p>
            <h2 className="mt-3 text-3xl font-bold text-white">{stats.totals.activeUsers}</h2>
            <p className="mt-2 text-xs text-slate-500">Total registered</p>
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* TOOL PERFORMANCE */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-bold text-white">Tool Performance</h2>
            <div className="mt-6 space-y-3">
              {stats.toolPerformance.slice(0, 8).map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="font-medium text-white">{tool.name}</p>
                    <p className="text-xs text-slate-400">{tool.runs} runs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-violet-400">${tool.profitUsd.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP USERS */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-bold text-white">Top Users</h2>
            <div className="mt-6 space-y-3">
              {stats.topUsers.slice(0, 8).map((user, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="font-medium text-white truncate">{user.email}</p>
                    <p className="text-xs text-slate-400">{user.runs} runs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">${user.spendUsd.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT USERS */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white">Recent Users</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left font-semibold text-slate-300">Email</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-300">Spending</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-300">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-white truncate">{user.email}</td>
                    <td className="px-4 py-3 text-right text-violet-400">${user.spendUsd.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
