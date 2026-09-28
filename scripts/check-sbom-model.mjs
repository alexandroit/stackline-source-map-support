import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createSbom } from './sbom-model.mjs'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'))
const sourceCommit = '0000000000000000000000000000000000000000'
const sbom = createSbom({
  lock,
  manifest,
  sourceCommit,
  timestamp: '2026-08-29T00:00:00.000Z'
})

assert.equal(sbom.components.length, 4)
assert.equal(sbom.metadata.component.properties.find((property) => property.name === 'stackline:installed-production-component-count').value, '3')
assert.equal(sbom.metadata.component.properties.find((property) => property.name === 'stackline:bundled-browser-material-count').value, '4')
assert.equal(sbom.metadata.component.properties.find((property) => property.name === 'stackline:source-commit').value, sourceCommit)

console.log('CycloneDX installed three-package graph, four bundled browser materials, root bundled edge, and VCS commit model passed.')

assert.equal(sbom.metadata.component.purl, `pkg:npm/%40stackline/source-map-support@${manifest.version}`)
assert.deepEqual(sbom.components.map(({ purl }) => purl), [
  'pkg:npm/%40jridgewell/trace-mapping@0.3.31',
  'pkg:npm/%40jridgewell/resolve-uri@3.1.2',
  'pkg:npm/%40jridgewell/sourcemap-codec@1.6.0',
  'pkg:npm/path-browserify@1.0.1'
])
const escapedRoot = createSbom({
  lock,
  manifest: { ...manifest, name: '@scope/name', version: '1.0.1+build.2' },
  sourceCommit,
  timestamp: '2026-08-29T00:00:00.000Z'
})
assert.equal(escapedRoot.metadata.component.purl, 'pkg:npm/%40scope/name@1.0.1%2Bbuild.2')
