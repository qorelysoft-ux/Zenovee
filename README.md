# Zenovee

## Current status (important)

This repository is **in progress** toward the current Zenovee premium multi-tools SaaS direction.

✅ Implemented so far:
- Monorepo structure: `apps/web` (Next.js + Tailwind) and `apps/api` (Express + TypeScript)
- Supabase client wiring for backend + frontend
- Basic auth pages on the web app (login/register/callback/dashboard)
- Current premium tool platform structure:
  - `/tools` directory
  - Category pages:
    - `/tools/marketing`
    - `/tools/dev-assistant`
    - `/tools/ecom-image`
    - `/tools/seo-growth`
    - `/tools/business-automation`
  - Individual premium tool pages: `/tools/<tool-slug>`
- Searchable tools directory with query handoff support (`/tools?q=...`)
- User dashboard improvements:
  - entitlement visibility
  - API key management
  - payment history view
- Admin dashboard improvements:
  - users and entitlements
  - audit logs
  - tool analytics
  - payment logs
  - tool enable/disable controls
- Build stability: `npm run build` works end-to-end
- Chrome Extension install/distribution pages:
  - `/extension` (guide + download button)
  - `/install` (redirect)
  - `/downloads/zenovee-tools-v0.1.0.zip` (hosted ZIP)
- Chrome extension capabilities:
  - login/logout
  - credit balance visibility
  - premium quick-launch buttons
  - selected-text handoff into `/tools?q=...`
  - popup search handoff into matching tools
- Razorpay credit billing flow:
  - `/api/billing/checkout`
  - `/api/billing/webhooks/razorpay`
  - shared credit wallet, ledger, and pay-as-you-go tool deductions
- In-app documentation page: `/documentation`
- Credit checkout page: `/checkout`

⏳ Still to implement (major items):
- live Razorpay key rollout and real payment verification in production
- final migration cleanup for databases that already contain manually created tables
- deeper extension direct-to-specific-tool workflows
- final production verification and hardening
- final release cleanup / final docs polish

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

Deploy the **Next.js app inside `apps/web`**.

#### Vercel project settings

1. Create a Vercel account and click **New Project**
2. Import this GitHub repo
3. Configure the project like this:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Output Directory**: leave empty/default
4. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
5. Redeploy after saving env vars

#### Important note about this app

This web app contains **Next.js API routes** under `apps/web/src/app/api/...`.
That means your Vercel deployment also needs server-side environment variables for:

- Prisma database access (`DATABASE_URL`)
- Gemini tool generation (`GEMINI_API_KEY`)
- Razorpay order creation + webhook verification (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`)

If `DATABASE_URL` is missing, admin/data-backed API routes will fail.
If `GEMINI_API_KEY` is missing, AI-powered tools will fail.
If Razorpay keys are missing, credit checkout and automatic top-ups will fail.

#### Recommended Vercel environment variables

Use these exact keys in Vercel for the `apps/web` deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
DATABASE_URL=<your-postgres-or-supabase-prisma-url>
GEMINI_API_KEY=<your-gemini-api-key>
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
RAZORPAY_WEBHOOK_SECRET=<your-razorpay-webhook-secret>
NODE_ENV=production
```

#### Manual deployment checklist

Before clicking Deploy in Vercel, confirm:

- Repo is connected to GitHub
- Root Directory is `apps/web`
- Build command is `npm run build`
- All required environment variables are added
- Prisma schema exists at `prisma/schema.prisma` in the repo root

#### If Vercel build fails

Most likely causes:

1. **Wrong Root Directory**
   - must be `apps/web`

2. **Missing `DATABASE_URL`**
   - required because the web app uses Prisma in API routes

3. **Missing `GEMINI_API_KEY`**
   - required for AI generation endpoints

4. **Missing Razorpay keys / webhook secret**
   - checkout and automatic credit top-ups will fail

5. **Invalid Supabase public keys**
   - login/register/dashboard will fail

6. **Database not migrated**
   - Prisma-backed routes may error until schema is applied

#### Domain mapping

After deployment succeeds:

1. Open your Vercel project
2. Go to **Domains**
3. Add your domain, for example:
   - `zenovee.in`
   - `www.zenovee.in`
4. Point DNS records from your domain provider to Vercel

#### Recommended first production checks

After deployment, test these URLs:

- `/`
- `/pricing`
- `/tools`
- `/login`
- `/register`
- `/dashboard`
- `/tools/viral-short-creator-engine`
- `/tools/code-documentation-generator`

Also test one AI tool and one non-AI tool after login.

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

## Monetization model

Zenovee now targets a **Razorpay credit wallet** model instead of subscriptions:

- users buy one-time credit packs
- Razorpay webhook credits the wallet automatically after successful payment
- every tool run deducts credits atomically
- one shared balance works across all categories

## Current migration note

If `prisma migrate deploy` fails with something like `relation "AdminAuditLog" already exists`, your database likely already contains tables that an old migration is trying to create.

That means you need to reconcile migration history before applying new migrations. Typical fix:

```bash
npx prisma migrate resolve --applied 20260322192500_add_admin_audit_log --schema prisma/schema.prisma
npx prisma migrate deploy --schema prisma/schema.prisma
```

Only do this if that table really already exists and matches the intended migration state.

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
