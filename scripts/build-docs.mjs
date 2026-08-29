import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const output = new URL('../site-dist/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

await rm(output, { force: true, recursive: true })
await mkdir(output, { recursive: true })

for (const file of [
  'CHANGELOG.md',
  'COMPATIBILITY_CONTRACT.md',
  'LICENSE',
  'MIGRATION.md',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md'
]) await cp(new URL(file, root), new URL(file, output))
await cp(new URL('LICENSES', root), new URL('LICENSES', output), { recursive: true })

for (const file of ['app.js', 'index.html', 'llms.txt', 'robots.txt', 'sitemap.xml', 'styles.css']) {
  await cp(new URL(`docs-site/${file}`, root), new URL(file, output))
}
await cp(new URL('browser-source-map-support.js', root), new URL('source-map-support-browser.js', output))
await writeFile(new URL('package-meta.json', output), `${JSON.stringify({
  browserSyntax: 'ES2015',
  name: manifest.name,
  nativeNodeRecommendation: true,
  version: manifest.version
}, null, 2)}\n`)

console.log('Built static public documentation into site-dist/.')
