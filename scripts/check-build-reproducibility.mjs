import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile, rm, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const outputs = ['browser-source-map-support.js', 'browser-source-map-support.mjs']
const modeCheckedFiles = [
  ...outputs,
  'LICENSES/jridgewell-trace-mapping-MIT.txt',
  'LICENSES/jridgewell-resolve-uri-MIT.txt',
  'LICENSES/jridgewell-sourcemap-codec-MIT.txt',
  'LICENSES/path-browserify-MIT.txt'
]

async function cleanBrowserOutputs () {
  await Promise.all(outputs.map((file) => rm(new URL(file, root), { force: true })))
}

function buildBrowserOutputs () {
  execFileSync(process.execPath, ['scripts/build.mjs'], {
    cwd: fileURLToPath(root),
    stdio: 'inherit'
  })
}

async function snapshot () {
  for (const file of modeCheckedFiles) {
    assert.equal((await stat(new URL(file, root))).mode & 0o777, 0o644, `${file} mode drifted`)
  }
  const entries = []
  for (const file of outputs) {
    const bytes = await readFile(new URL(file, root))
    entries.push([file, createHash('sha256').update(bytes).digest('hex')])
  }
  return Object.fromEntries(entries)
}

await cleanBrowserOutputs()
buildBrowserOutputs()
const cleanBuild = await snapshot()

buildBrowserOutputs()
const consecutiveBuild = await snapshot()

await cleanBrowserOutputs()
buildBrowserOutputs()
const secondCleanBuild = await snapshot()

assert.deepEqual(consecutiveBuild, cleanBuild)
assert.deepEqual(secondCleanBuild, cleanBuild)

const esm = await readFile(new URL('browser-source-map-support.mjs', root), 'utf8')
assert.doesNotMatch(esm, /define\(['"]browser-source-map-support/)
assert.doesNotMatch(esm, /root\.sourceMapSupport\s*=\s*factory/)
assert.doesNotMatch(esm, /typeof module === ['"]object['"] && module\.exports/)

console.log(`Consecutive and clean browser builds are identical: ${JSON.stringify(cleanBuild)}`)
