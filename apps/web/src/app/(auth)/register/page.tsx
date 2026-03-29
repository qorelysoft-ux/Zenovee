"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error

      // With email confirmation disabled, Supabase returns an active session.
      if (data.session) {
        router.replace('/dashboard')
        router.refresh()
        return
      }

      // If your Supabase project is configured to require email confirmation,
      // you won’t get a session here.
      setMessage('Account created. Please confirm your email (if required) and then log in.')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="zen-card-strong rounded-[2rem] p-8">
        <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Create account
        </div>
        <h1 className="mt-5 text-4xl font-semibold text-white">Join the premium workflow system.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Create your account, pick the suite that matches your bottleneck, and unlock a more focused way to execute marketing, development, SEO, image, and ops work.
        </p>
        <div className="mt-8 grid gap-3">
          {['Focused premium suites', 'Clear dashboard and billing controls', 'Access from web and Chrome extension'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="zen-card rounded-[2rem] p-8">
        <h2 className="text-3xl font-semibold text-white">Register</h2>
        <p className="mt-2 text-sm text-slate-300">Create your account, then subscribe to a category to unlock tools.</p>

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
              minLength={8}
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
          <p className="mt-1 text-xs text-slate-400">Minimum 8 characters.</p>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          type="submit"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-white underline">
          Login
        </Link>
      </p>
      </div>
    </div>
  )
}
