"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed'
      // Common Supabase messages are a bit confusing; make them user-friendly.
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password.')
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Please confirm your email first, then try logging in.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="zen-card-strong rounded-[2rem] p-8">
        <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
          Member access
        </div>
        <h1 className="mt-5 text-4xl font-semibold text-white">Return to your premium workspace.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Sign in to access your purchased suites, continue active workflows, manage subscriptions, and launch tools faster.
        </p>
        <div className="mt-8 grid gap-3">
          {['Paid-only access model', 'Category-based premium unlocks', 'Dashboard, tools, extension, and billing controls'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="zen-card rounded-[2rem] p-8">
        <h2 className="text-3xl font-semibold text-white">Login</h2>
        <p className="mt-2 text-sm text-slate-300">No free tier. Purchase a category to access tools.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Password</label>
          <div className="mt-1 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <input
              className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          type="submit"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        Don’t have an account?{' '}
        <Link href="/register" className="font-semibold text-white underline">
          Register
        </Link>
      </p>
      </div>
    </div>
  )
}
