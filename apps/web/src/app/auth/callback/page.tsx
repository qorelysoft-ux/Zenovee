"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Supabase completes OAuth in the URL fragment; the JS client parses it.
    // After session is set, we redirect.
    ;(async () => {
      await supabase.auth.getSession()
      router.replace('/dashboard')
      router.refresh()
    })()
  }, [router])

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Signing you in…</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Please wait.</p>
    </div>
  )
}
