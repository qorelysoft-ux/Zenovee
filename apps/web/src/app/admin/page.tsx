"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabaseClient'
import { apiFetch } from '@/lib/api'

type Category = 'AI' | 'DEVELOPER' | 'IMAGE' | 'SEO' | 'TEXT' | 'UTILITY'

type AdminUserRow = {
  id: string
  email: string
  role: string
  supabaseUserId: string | null
  createdAt: string
  entitlements: { category: string; status: string; currentPeriodEnd: string | null }[]
}

type AuditLogRow = {
  id: string
  actorEmail: string | null
  action: string
  targetEmail: string | null
  category: string | null
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [meEmail, setMeEmail] = useState<string | null>(null)
  const [targetEmail, setTargetEmail] = useState('')
  const [category, setCategory] = useState<Category>('DEVELOPER')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [q, setQ] = useState('')
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  const [logs, setLogs] = useState<AuditLogRow[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  const categories = useMemo(
    () => ['AI', 'DEVELOPER', 'IMAGE', 'SEO', 'TEXT', 'UTILITY'] as Category[],
    [],
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      if (!data.user) {
        router.replace('/login')
        return
      }

      setMeEmail(data.user.email ?? null)

      try {
        // If not admin, API returns 403; we show a clean message.
        await apiFetch<{ ok: true; user: any }>('/me')
        await refreshUsers('')
        await refreshLogs()
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [router])

  async function refreshUsers(nextQ: string) {
    setUsersLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; users: AdminUserRow[] }>(
        `/admin/users?q=${encodeURIComponent(nextQ)}&take=50`,
      )
      setUsers(resp.users)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed_to_load_users')
    } finally {
      setUsersLoading(false)
    }
  }

  async function refreshLogs() {
    setLogsLoading(true)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true; logs: AuditLogRow[] }>(`/admin/audit-logs?take=50`)
      setLogs(resp.logs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed_to_load_logs')
    } finally {
      setLogsLoading(false)
    }
  }

  async function grant() {
    setStatus(null)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true }>('/admin/entitlements/grant', {
        method: 'POST',
        body: JSON.stringify({ email: targetEmail.trim(), category }),
      })
      if (resp.ok) setStatus(`Granted ${category} to ${targetEmail}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed')
    }
  }

  async function revoke() {
    setStatus(null)
    setError(null)
    try {
      const resp = await apiFetch<{ ok: true }>('/admin/entitlements/revoke', {
        method: 'POST',
        body: JSON.stringify({ email: targetEmail.trim(), category }),
      })
      if (resp.ok) setStatus(`Revoked ${category} from ${targetEmail}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed')
    }
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
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Signed in as <span className="font-medium">{meEmail ?? 'unknown'}</span>
      </p>

      <div className="mt-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Grant / Revoke category access</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This is temporary admin tooling until Razorpay subscriptions are enabled.
        </p>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-medium">User email</label>
            <input
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="user@example.com"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-2 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={grant}
              disabled={!targetEmail.trim()}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Grant access
            </button>
            <button
              onClick={revoke}
              disabled={!targetEmail.trim()}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-zinc-700"
            >
              Revoke access
            </button>
          </div>

          {status ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{status}</p> : null}
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error} (If you see "forbidden", you are not ADMIN yet.)
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">Audit logs</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Shows recent admin actions (grant/revoke). If empty, run the DB migration and then do one grant/revoke.
            </p>
          </div>
          <button
            onClick={refreshLogs}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Refresh
          </button>
        </div>

        {logsLoading ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Loading logs…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs text-zinc-500">
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">When</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Actor</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Action</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Target</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Category</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-zinc-600 dark:text-zinc-300">
                      No audit logs yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id}>
                      <td className="border-b border-zinc-100 py-3 pr-4 text-xs text-zinc-500 dark:border-zinc-900">
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{l.actorEmail ?? '—'}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{l.action}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{l.targetEmail ?? '—'}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{l.category ?? '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">Users</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Search users and see their active entitlements.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email or supabaseUserId"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-zinc-700 md:w-[420px]"
          />
          <button
            onClick={() => refreshUsers(q)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Search
          </button>
          <button
            onClick={() => {
              setQ('')
              refreshUsers('')
            }}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Reset
          </button>
        </div>

        {usersLoading ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Loading users…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs text-zinc-500">
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Email</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Role</th>
                  <th className="border-b border-zinc-200 py-2 pr-4 dark:border-zinc-800">Entitlements</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-zinc-600 dark:text-zinc-300">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">
                        <div className="font-medium">{u.email}</div>
                        <div className="mt-1 text-xs text-zinc-500">{u.supabaseUserId ?? '—'}</div>
                      </td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">{u.role}</td>
                      <td className="border-b border-zinc-100 py-3 pr-4 dark:border-zinc-900">
                        <div className="flex flex-wrap gap-2">
                          {u.entitlements.length === 0 ? (
                            <span className="text-xs text-zinc-500">—</span>
                          ) : (
                            u.entitlements.map((e, idx) => (
                              <span
                                key={`${u.id}-${e.category}-${idx}`}
                                className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                              >
                                {e.category}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
