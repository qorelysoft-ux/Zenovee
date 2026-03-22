import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = path.resolve(process.cwd())
const distDir = path.join(root, 'dist')
const outDir = path.join(root, 'release')

function ensureDist() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist folder missing. Run: npm -w @zenovee/extension run build')
  }
  const manifestPath = path.join(distDir, 'manifest.json')
  if (!fs.existsSync(manifestPath)) {
    throw new Error('dist/manifest.json missing. Run: npm -w @zenovee/extension run build')
  }
}

function getVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  return pkg.version || '0.0.0'
}

ensureDist()
fs.mkdirSync(outDir, { recursive: true })

const version = getVersion()
const zipName = `zenovee-tools-v${version}.zip`
const zipPath = path.join(outDir, zipName)

// Create zip using Windows PowerShell Compress-Archive
// Zips the *contents* of dist (so manifest.json is at the root of the zip)
const ps = `powershell -NoProfile -Command "` +
  `if (Test-Path '${zipPath}') { Remove-Item -Force '${zipPath}' }; ` +
  `Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}'"`

execSync(ps, { stdio: 'inherit' })
console.log(`[extension] created: ${zipPath}`)
