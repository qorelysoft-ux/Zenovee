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

  async function onGoogle() {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        No free tier. Purchase a category to access tools.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <div className="mt-1 flex overflow-hidden rounded-md border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <input
              className="w-full bg-transparent px-3 py-2 text-sm outline-none"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          type="submit"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={onGoogle}
          className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
        >
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-300">
        Don’t have an account?{' '}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  )
}
