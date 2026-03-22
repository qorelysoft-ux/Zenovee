import fs from 'node:fs'
import path from 'node:path'
import esbuild from 'esbuild'

const args = new Set(process.argv.slice(2))
const watch = args.has('--watch')

const root = path.resolve(process.cwd())
const srcDir = path.join(root, 'src')
const distDir = path.join(root, 'dist')

function copyFile(rel) {
  const from = path.join(srcDir, rel)
  const to = path.join(distDir, rel)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}

async function bundle(entryRel, outRel) {
  const entry = path.join(srcDir, entryRel)
  const outfile = path.join(distDir, outRel)
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['chrome114'],
    outfile,
    sourcemap: false,
    legalComments: 'none',
    logLevel: 'silent',
  })
}

async function build() {
  fs.rmSync(distDir, { recursive: true, force: true })
  fs.mkdirSync(distDir, { recursive: true })

  copyFile('manifest.json')
  copyFile('popup.html')
  copyFile('style.css')
  await bundle('popup.js', 'popup.js')
  await bundle('background.js', 'background.js')
  console.log('[extension] built to apps/extension/dist')
}

await build()

if (watch) {
  console.log('[extension] watching for changes...')
  fs.watch(srcDir, { recursive: true }, () => {
    try {
      build()
    } catch (e) {
      console.error(e)
    }
  })
}
