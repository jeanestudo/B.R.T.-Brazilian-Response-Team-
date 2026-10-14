// node tools/glbshot.mjs out.png /path/in/public.glb [views] [anim] [t]
// Files outside public/ are copied to public/__tmp/ for serving (cleaned up afterwards).
import { chromium } from 'playwright'
import { copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { basename, resolve } from 'node:path'
const [out, file, views = 'front,side', anim = '', t = '0.3'] = process.argv.slice(2)
let url = file
if (file.startsWith('/') && !file.startsWith('/assets/')) {
  mkdirSync('public/__tmp', { recursive: true }); copyFileSync(resolve(file), `public/__tmp/${basename(file)}`); url = `/__tmp/${basename(file)}`
}
const args = ['--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
const b = await chromium.launch({ args })
const n = views.split(',').length
const p = await b.newPage({ viewport: { width: 400 * n, height: 500 } })
p.on('pageerror', e => console.log('ERR', e.message))
await p.goto(`http://localhost:3000/tools/glbview.html?f=${encodeURIComponent(url)}&views=${views}&w=400&h=500&anim=${anim}&t=${t}`)
await p.waitForFunction(() => document.title === 'done', null, { timeout: 120000 })
console.log(JSON.stringify(await p.evaluate(() => window.__info)))
await p.screenshot({ path: out })
await b.close()
if (url.startsWith('/__tmp/')) rmSync(`public/__tmp/${basename(file)}`)
