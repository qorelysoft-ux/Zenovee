import path from 'node:path'
import dotenv from 'dotenv'
import fs from 'node:fs'

/**
 * Loads env vars from the monorepo root `.env`.
 *
 * Why: when running the API from different working directories (VSCode, prod),
 * relying on dotenv default lookup can be brittle.
 */
export function loadEnv() {
  // Robust `.env` loading for monorepos:
  // - When running via npm workspaces, `process.cwd()` can be repo root OR `apps/api`.
  // - We search upward for a `.env`.
  const explicit = process.env.ENV_PATH
  if (explicit) {
    dotenv.config({ path: explicit })
    return
  }

  const candidates: string[] = []
  let dir = process.cwd()
  for (let i = 0; i < 6; i++) {
    candidates.push(path.join(dir, '.env'))
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  const found = candidates.find((p) => fs.existsSync(p))
  dotenv.config(found ? { path: found } : undefined)
}

export function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}
