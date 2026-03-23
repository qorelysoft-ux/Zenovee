# Zenovee

## Current status (important)

This repository is **in progress** toward the full “Paid Halal Multi-Tools SaaS” master prompt.

✅ Implemented so far:
- Monorepo structure: `apps/web` (Next.js + Tailwind) and `apps/api` (Express + TypeScript)
- Supabase client wiring for backend + frontend
- Basic auth pages on the web app (login/register/callback/dashboard)
- Tools routing skeleton:
  - `/tools` directory
  - Category pages: `/tools/ai`, `/tools/developer`, `/tools/image`, `/tools/seo`, `/tools/text`, `/tools/utilities`
  - Individual tool SEO pages: `/tools/<tool-slug>` (placeholder UI + entitlement gate)
- Build stability: `npm run build` works end-to-end
- Chrome Extension install/distribution pages:
  - `/extension` (guide + download button)
  - `/install` (redirect)
  - `/downloads/zenovee-tools-v0.1.0.zip` (hosted ZIP)

⏳ Still to implement (major items):
- Razorpay subscriptions + webhook verification + subscription lifecycle
- Paid-only category entitlements + tool gating (no free tier)
- 50 functional tools + SEO tool pages (`/tools/tool-name`) and category listings
- User dashboard (subscriptions/payment history) + Admin dashboard
- Chrome extension
- Security hardening + analytics + caching + full deployment docs

---

## Chrome Extension distribution (current approach)

Until the extension is published to the Chrome Web Store, Zenovee distributes it as an **unpacked extension**.

### Download link (production)

- `https://www.zenovee.in/extension`
- ZIP download: `https://www.zenovee.in/downloads/zenovee-tools-v0.1.0.zip`

### Build/package locally

```bash
npm -w @zenovee/extension run build
npm -w @zenovee/extension run package
```

Output:

`apps/extension/release/zenovee-tools-v0.1.0.zip`

---

## Local development (Windows)

### 1) Install dependencies

From repo root:

```bash
npm install
```

### 2) Configure Supabase

Create a **Supabase** project, then set:

**Root `.env`** (server only):

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

**Web `.env.local`** (`apps/web/.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3) Run the apps

Web:

```bash
npm run dev
```

API (separate terminal):

```bash
npm run dev:api
```

API health check:

```bash
curl http://localhost:4000/health/db
```

---

## Deployment (beginner-friendly)

You said you “don’t know anything” about deployment — no problem.

### Frontend (Vercel)

1. Create a Vercel account and click **“New Project”**
2. Import this GitHub repo
3. In Vercel, set:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output**: (leave default)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### Backend API (any cloud server)

You can deploy `apps/api` to a VM (DigitalOcean/AWS/Linode) or a PaaS.
Minimum required env vars on the server:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PORT=4000
```

Start command:

```bash
npm run start
```

---

## Next milestone

The next big milestone is **Razorpay subscriptions + paid-only category gating**.
Once that is in place, we can begin adding the tools (SEO pages + related tools + FAQs) category-by-category.

## API Database Connectivity (Supabase)

This repo uses the **official Supabase client** (`@supabase/supabase-js`) on the backend instead of connecting to Postgres directly from Node.

Why:
- avoids local TLS/certificate issues
- uses Supabase-supported patterns
- keeps secrets server-side

### Required environment variables

Set these in the **monorepo root** `.env`:

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

Security note: never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.

### Health check

Run the API:

```bash
npm run dev:api
```

Then:

```bash
curl http://localhost:4000/health/db
```

Expected response:

```json
{ "ok": true, "userCount": 0 }
```
