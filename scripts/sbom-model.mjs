import assert from 'node:assert/strict'

export const installedProduction = [
  ['@jridgewell/trace-mapping', '0.3.31'],
  ['@jridgewell/resolve-uri', '3.1.2'],
  ['@jridgewell/sourcemap-codec', '1.6.0']
]

export const bundledBrowserMaterial = [
  ...installedProduction,
  ['path-browserify', '1.0.1']
]

const npmPurl = (name, version) => `pkg:npm/${name.split('/').map(encodeURIComponent).join('/')}@${encodeURIComponent(version)}`

const componentRef = (name, version) => `${name}@${version}`
const componentPath = (name) => `node_modules/${name}`

export function createSbom ({ lock, manifest, sourceCommit, timestamp }) {
  assert.match(sourceCommit, /^[0-9a-f]{40}$/)
  assert.equal(new Date(timestamp).toISOString(), timestamp)

  const installedRefs = new Set(installedProduction.map(([name, version]) => componentRef(name, version)))
  const components = bundledBrowserMaterial.map(([name, version]) => {
    const metadata = lock.packages[componentPath(name)]
    assert.equal(metadata.version, version, `${name} lock version drifted`)
    assert.equal(metadata.license, 'MIT', `${name} lock license drifted`)
    return {
      type: 'library',
      'bom-ref': componentRef(name, version),
      name,
      version,
      licenses: [{ license: { id: 'MIT' } }],
      purl: npmPurl(name, version),
      externalReferences: metadata.resolved
        ? [{ type: 'distribution', url: metadata.resolved }]
        : undefined,
      properties: [
        ...(metadata.integrity ? [{ name: 'npm:integrity', value: metadata.integrity }] : []),
        { name: 'stackline:installed-production', value: String(installedRefs.has(componentRef(name, version))) },
        { name: 'stackline:bundled-browser-material', value: 'true' }
      ]
    }
  })

  const rootRef = componentRef(manifest.name, manifest.version)
  const traceRef = componentRef('@jridgewell/trace-mapping', '0.3.31')
  const resolveRef = componentRef('@jridgewell/resolve-uri', '3.1.2')
  const codecRef = componentRef('@jridgewell/sourcemap-codec', '1.6.0')
  const pathBrowserifyRef = componentRef('path-browserify', '1.0.1')
  const repository = manifest.repository.url.replace(/^git\+/, '')
  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    serialNumber: 'urn:uuid:534d5300-0000-4000-8000-000000010000',
    version: 1,
    metadata: {
      timestamp,
      component: {
        type: 'library',
        'bom-ref': rootRef,
        name: manifest.name,
        version: manifest.version,
        licenses: [{ license: { id: 'MIT' } }],
        purl: npmPurl(manifest.name, manifest.version),
        externalReferences: [{ type: 'vcs', url: `${repository}#${sourceCommit}` }],
        properties: [
          { name: 'stackline:source-commit', value: sourceCommit },
          { name: 'stackline:installed-production-component-count', value: '3' },
          { name: 'stackline:bundled-browser-material-count', value: '4' }
        ]
      }
    },
    components,
    dependencies: [
      // The root has one installed runtime dependency and one build-time
      // component copied into its browser artifacts. Component properties
      // preserve that distinction while this edge records both relationships.
      { ref: rootRef, dependsOn: [traceRef, pathBrowserifyRef] },
      { ref: traceRef, dependsOn: [resolveRef, codecRef] },
      { ref: resolveRef, dependsOn: [] },
      { ref: codecRef, dependsOn: [] },
      { ref: pathBrowserifyRef, dependsOn: [] }
    ]
  }

  assert.deepEqual(
    new Set(components.map((component) => component['bom-ref'])),
    new Set(bundledBrowserMaterial.map(([name, version]) => componentRef(name, version)))
  )
  assert.equal(components.length, 4)
  assert.equal(components.filter((component) => component.properties.some((property) => property.name === 'stackline:installed-production' && property.value === 'true')).length, 3)
  assert.equal(components.find((component) => component['bom-ref'] === pathBrowserifyRef).properties.some((property) => property.name === 'stackline:installed-production' && property.value === 'false'), true)
  assert.deepEqual(sbom.dependencies.find((edge) => edge.ref === rootRef).dependsOn, [traceRef, pathBrowserifyRef])
  assert.deepEqual(new Set(sbom.dependencies.find((edge) => edge.ref === traceRef).dependsOn), new Set([resolveRef, codecRef]))
  assert.equal(sbom.metadata.component.externalReferences[0].url, `${repository}#${sourceCommit}`)
  return sbom
}
