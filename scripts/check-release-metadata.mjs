import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const metadata = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const decision = JSON.parse(await readFile(new URL('decision.json', root), 'utf8'))

assert.equal(metadata.name, '@stackline/source-map-support')
assert.equal(metadata.version, '1.0.0')
assert.equal(metadata.license, 'MIT')
assert.equal(metadata.engines.node, '>=14.15.1')
assert.equal(decision.decision, 'GO')
assert.equal(decision.target, '@stackline/source-map-support')
assert.equal(decision.targetVersion, '1.0.0')
assert.equal(decision.implementationStartedAtDecisionWrite, false)
await Promise.all(metadata.files.map((filename) => access(new URL(filename, root))))

console.log('Frozen GO decision and public package inventory passed.')
