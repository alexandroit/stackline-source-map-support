import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
assert.equal(manifest.license, 'MIT')
assert.deepEqual(manifest.dependencies, { '@jridgewell/trace-mapping': '0.3.31' })

for (const [name, version] of [
  ['@jridgewell/trace-mapping', '0.3.31'],
  ['@jridgewell/resolve-uri', '3.1.2'],
  ['@jridgewell/sourcemap-codec', '1.6.0']
]) {
  const directory = new URL(`node_modules/${name}/`, root)
  const dependency = JSON.parse(await readFile(new URL('package.json', directory), 'utf8'))
  assert.equal(dependency.version, version, `${name} version drifted`)
  assert.equal(dependency.license, 'MIT')
  assert.ok((await readdir(directory)).some((file) => /^licen[cs]e/i.test(file)))
}

const license = await readFile(new URL('LICENSE', root), 'utf8')
assert.match(license, /Copyright \(c\) 2014 Evan Wallace/)
const notice = await readFile(new URL('NOTICE', root), 'utf8')
assert.match(notice, /Copyright 2012 the V8 project authors/)
const v8 = await readFile(new URL('LICENSES/V8-BSD-3-Clause.txt', root), 'utf8')
assert.match(v8, /Copyright 2006-2011, the V8 project authors/)
assert.match(v8, /Neither the name of Google Inc\./)

for (const [upstream, copied] of [
  ['node_modules/@jridgewell/trace-mapping/LICENSE', 'LICENSES/jridgewell-trace-mapping-MIT.txt'],
  ['node_modules/@jridgewell/resolve-uri/LICENSE', 'LICENSES/jridgewell-resolve-uri-MIT.txt'],
  ['node_modules/@jridgewell/sourcemap-codec/LICENSE', 'LICENSES/jridgewell-sourcemap-codec-MIT.txt'],
  ['node_modules/path-browserify/LICENSE', 'LICENSES/path-browserify-MIT.txt']
]) {
  assert.deepEqual(
    await readFile(new URL(copied, root)),
    await readFile(new URL(upstream, root)),
    `${copied} is not an exact copy of ${upstream}`
  )
}
const pathBrowserify = JSON.parse(await readFile(new URL('node_modules/path-browserify/package.json', root), 'utf8'))
assert.equal(pathBrowserify.version, '1.0.1')
assert.equal(pathBrowserify.license, 'MIT')
const thirdParty = await readFile(new URL('THIRD_PARTY_LICENSES.md', root), 'utf8')
for (const name of ['@jridgewell/trace-mapping', '@jridgewell/resolve-uri', '@jridgewell/sourcemap-codec', 'path-browserify']) {
  assert.ok(thirdParty.includes(name), `${name} missing from third-party inventory`)
}

console.log('Evan Wallace MIT, copied-V8 BSD-3, installed graph, and exact bundled browser MIT bytes passed.')
