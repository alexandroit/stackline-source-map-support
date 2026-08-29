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
