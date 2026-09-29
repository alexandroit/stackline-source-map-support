import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const output = new URL('../site-dist/', import.meta.url)
const required = [
  'CHANGELOG.md',
  'COMPATIBILITY_CONTRACT.md',
  'LICENSE',
  'LICENSES/V8-BSD-3-Clause.txt',
  'LICENSES/jridgewell-resolve-uri-MIT.txt',
  'LICENSES/jridgewell-sourcemap-codec-MIT.txt',
  'LICENSES/jridgewell-trace-mapping-MIT.txt',
  'LICENSES/path-browserify-MIT.txt',
  'MIGRATION.md',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md',
  'app.js',
  'index.html',
  'llms.txt',
  'package-meta.json',
  'robots.txt',
  'sitemap.xml',
  'source-map-support-browser.js',
  'styles.css'
]
await Promise.all(required.map((file) => access(new URL(file, output))))

const html = await readFile(new URL('index.html', output), 'utf8')
assert.match(html, /@stackline\/source-map-support/)
assert.match(html, /Alexandro\.Net maintained compatibility/)
assert.match(html, /Native Node\.js/)
assert.match(html, /ES2015/)
assert.match(html, /not affiliated with or endorsed by Evan Wallace/)
assert.doesNotMatch(html, /TODO|PLACEHOLDER/)
const robots = await readFile(new URL('robots.txt', output), 'utf8')
assert.match(robots, /Sitemap: https:\/\/alexandro\.net\/docs\/vanilla\/source-map-support\/sitemap\.xml/)
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8')
assert.match(sitemap, /https:\/\/alexandro\.net\/docs\/vanilla\/source-map-support\//)
const metadata = JSON.parse(await readFile(new URL('package-meta.json', output), 'utf8'))
assert.deepEqual(metadata, {
  browserSyntax: 'ES2015',
  name: '@stackline/source-map-support',
  nativeNodeRecommendation: true,
  version: '1.0.2'
})

console.log('Static docs inventory, metadata, native boundary, and crawl files passed.')
