import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// NOTE: For a real publishable extension, avoid using a public CDN import.
// Next step will be bundling this locally. This scaffold is to get you working quickly.

const SUPABASE_URL = 'https://dzxyireteouaufqpzyuo.supabase.co'
// This is a public key, safe to ship in client/extension.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eHlpcmV0ZW91YXVmcXB6eXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjMzMDgsImV4cCI6MjA4ODg5OTMwOH0.00uZiRU77uUsmCkoheMqpcvPzC0VPcPqvYkpREremG4'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const statusEl = document.getElementById('status')
const entsEl = document.getElementById('ents')
const emailEl = document.getElementById('email')
const passEl = document.getElementById('password')
const loginBtn = document.getElementById('login')
const logoutBtn = document.getElementById('logout')

function setStatus(text) {
  statusEl.textContent = text
}

async function fetchEntitlements(accessToken) {
  const resp = await fetch('https://www.zenovee.in/api/me/entitlements', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!resp.ok) throw new Error(`entitlements_http_${resp.status}`)
  const json = await resp.json()
  return json.entitlements ?? []
}

async function refresh() {
  setStatus('Checking session…')
  const { data } = await supabase.auth.getSession()
  const session = data.session
  if (!session) {
    setStatus('Not logged in')
    entsEl.textContent = '—'
    return
  }

  setStatus(`Logged in as ${session.user.email}`)
  try {
    const ents = await fetchEntitlements(session.access_token)
    entsEl.textContent = ents.length ? ents.map((e) => e.category).join(', ') : 'No entitlements'
  } catch (e) {
    entsEl.textContent = 'Failed to load entitlements'
  }
}

loginBtn.addEventListener('click', async () => {
  try {
    setStatus('Logging in…')
    const email = emailEl.value.trim()
    const password = passEl.value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await refresh()
  } catch (e) {
    setStatus(e?.message ?? 'Login failed')
  }
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  await refresh()
})

refresh()
