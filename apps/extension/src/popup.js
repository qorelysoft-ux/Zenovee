import { createClient } from '@supabase/supabase-js'

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
const quickToolsEl = document.getElementById('quickTools')
const openSelectionToolBtn = document.getElementById('openSelectionTool')
const searchSelectionToolBtn = document.getElementById('searchSelectionTool')
const openDashboardBtn = document.getElementById('openDashboard')
const toolSearchEl = document.getElementById('toolSearch')
const openSearchResultsBtn = document.getElementById('openSearchResults')
const openMarketingToolBtn = document.getElementById('openMarketingTool')

const categoryToUrls = {
  MARKETING: ['viral-short-creator-engine'],
  DEV_ASSISTANT: ['code-documentation-generator'],
  ECOM_IMAGE: ['multi-platform-image-resizer'],
  SEO_GROWTH: ['keyword-cluster-engine'],
  BUSINESS_AUTOMATION: ['meeting-notes-to-email-converter', 'dynamic-qr-code-system'],
}

function setStatus(text) {
  statusEl.textContent = text
}

function setQuickToolAccess(entitlements = []) {
  const activeCategories = new Set(entitlements.filter((e) => e.status === 'ACTIVE').map((e) => e.category))
  const buttons = [...document.querySelectorAll('.tool-btn')]
  buttons.forEach((btn) => {
    const url = btn.dataset.url || ''
    const slug = url.split('/tools/')[1] || ''
    const allowed = Object.entries(categoryToUrls).some(([category, slugs]) => activeCategories.has(category) && slugs.includes(slug))
    btn.classList.toggle('locked', !allowed)
    btn.title = allowed ? 'Open tool' : 'Locked: requires matching category access'
  })
}

function openUrl(url) {
  chrome.tabs.create({ url })
}

function buildToolsSearchUrl(query, extra = '') {
  const q = (query || '').trim().slice(0, 200)
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (extra) params.set('hint', extra)
  const next = params.toString()
  return next ? `https://www.zenovee.in/tools?${next}` : 'https://www.zenovee.in/tools'
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
    setQuickToolAccess(ents)
  } catch (e) {
    entsEl.textContent = 'Failed to load entitlements'
    setQuickToolAccess([])
  }
}

quickToolsEl?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tool-btn')
  if (!btn) return
  openUrl(btn.dataset.url)
})

openSelectionToolBtn?.addEventListener('click', async () => {
  const [{ selectionText = '' } = {}] = await chrome.scripting.executeScript({
    target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
    func: () => ({ selectionText: window.getSelection()?.toString() || '' }),
  }).catch(() => [{}])

  const base = 'https://www.zenovee.in/tools'
  const url = selectionText ? `${base}?q=${encodeURIComponent(selectionText.slice(0, 200))}` : base
  openUrl(url)
})

searchSelectionToolBtn?.addEventListener('click', async () => {
  const [{ selectionText = '' } = {}] = await chrome.scripting
    .executeScript({
      target: { tabId: (await chrome.tabs.query({ active: true, currentWindow: true }))[0].id },
      func: () => ({ selectionText: window.getSelection()?.toString() || '' }),
    })
    .catch(() => [{}])

  openUrl(buildToolsSearchUrl(selectionText, 'selection'))
})

openSearchResultsBtn?.addEventListener('click', () => {
  openUrl(buildToolsSearchUrl(toolSearchEl?.value || '', 'popup'))
})

openMarketingToolBtn?.addEventListener('click', () => {
  const q = toolSearchEl?.value || ''
  const next = q ? `https://www.zenovee.in/tools/marketing?q=${encodeURIComponent(q.slice(0, 200))}` : 'https://www.zenovee.in/tools/marketing'
  openUrl(next)
})

openDashboardBtn?.addEventListener('click', () => openUrl('https://www.zenovee.in/dashboard'))

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
