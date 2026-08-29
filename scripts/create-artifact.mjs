import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createSbom } from './sbom-model.mjs'

const root = new URL('../', import.meta.url)
const rootPath = fileURLToPath(root)
const output = fileURLToPath(new URL('../release-candidate/', import.meta.url))

function run (command, args) {
  const result = spawnSync(command, args, {
    cwd: rootPath,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result.stdout.trim()
}

function git (args) {
  return run('git', args)
}

const npmVersion = run('npm', ['--version'])
assert.equal(npmVersion, '10.8.2', 'artifact preparation requires the exact npm version used by CI')

const sourceCommit = git(['rev-parse', '--verify', 'HEAD'])
assert.match(sourceCommit, /^[0-9a-f]{40}$/, 'artifact preparation requires a full Git HEAD')
assert.match(process.env.STACKLINE_GREEN_COMMIT || '', /^[0-9a-f]{40}$/, 'set STACKLINE_GREEN_COMMIT to the exact CI-green commit')
assert.equal(process.env.STACKLINE_GREEN_COMMIT, sourceCommit, 'STACKLINE_GREEN_COMMIT does not match HEAD')
assert.equal(git(['status', '--porcelain=v1', '--untracked-files=all']), '', 'artifact preparation requires a clean worktree')

const commitTimestamp = new Date(git(['show', '-s', '--format=%cI', sourceCommit])).toISOString()

// Browser outputs are ignored generated files. Always rebuild them from the
// approved commit instead of trusting bytes left by an earlier local build.
run('npm', ['run', 'build'])
assert.equal(git(['status', '--porcelain=v1', '--untracked-files=all']), '', 'deterministic build changed tracked source files')

await mkdir(output, { recursive: false })
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'))
const pack = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', output]))[0]
const tarball = path.join(output, pack.filename)
const bytes = await readFile(tarball)
const hashes = {}
for (const algorithm of ['sha1', 'sha256', 'sha512']) {
  hashes[algorithm] = createHash(algorithm).update(bytes).digest('hex')
  await writeFile(path.join(output, `${algorithm.toUpperCase()}SUMS`), `${hashes[algorithm]}  ${pack.filename}\n`)
}

const sbom = createSbom({
  lock,
  manifest,
  sourceCommit,
  timestamp: commitTimestamp
})
await writeFile(path.join(output, 'sbom.cdx.json'), `${JSON.stringify(sbom, null, 2)}\n`)
await writeFile(path.join(output, 'inventory.json'), `${JSON.stringify(pack.files, null, 2)}\n`)
await writeFile(path.join(output, 'release-manifest.json'), `${JSON.stringify({
  commitTimestamp,
  fileCount: pack.entryCount,
  filename: pack.filename,
  hashes,
  integrity: pack.integrity,
  name: pack.name,
  npmVersion,
  packedSize: pack.size,
  sourceCommit,
  unpackedSize: pack.unpackedSize,
  version: pack.version
}, null, 2)}\n`)
await writeFile(path.join(output, 'RELEASE_NOTES.md'), [
  '# @stackline/source-map-support 1.0.0 release candidate',
  '',
  'Compatibility continuation of source-map-support 0.5.21 for VM, browser,',
  'Electron, and custom retrieval-hook consumers. Ordinary modern Node.js',
  'applications should prefer native source-map support.',
  '',
  `Source commit: ${sourceCommit}`,
  '',
  'This artifact is untagged and unpublished. See release-manifest.json for',
  'immutable local hashes and inventory.json for exact packed files.',
  ''
].join('\n'))

console.log(JSON.stringify({ tarball, hashes, integrity: pack.integrity, sourceCommit }, null, 2))
