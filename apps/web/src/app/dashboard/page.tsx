"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'

type UserInfo = {
  email?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
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
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Next steps</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            Go to <Link href="/pricing" className="underline">Pricing</Link> to buy category access (Razorpay integration next).
          </li>
          <li>
            Browse <Link href="/tools" className="underline">Tools</Link> (tool pages coming next).
          </li>
        </ul>
      </div>
    </div>
  )
}
