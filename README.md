# Zenovee

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
