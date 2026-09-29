import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-source-map-support-pack-'))
let tarball

function run (command, args, cwd = temporary) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result
}

try {
  const packed = run('npm', ['pack', '--json', '--ignore-scripts'], root)
  const packResult = JSON.parse(packed.stdout)[0]
  tarball = path.join(root, packResult.filename)
  const paths = packResult.files.map((file) => file.path)
  for (const file of packResult.files) {
    assert.equal(file.mode, 0o644, `packed file mode is not 0644: ${file.path}`)
  }

  for (const required of [
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
    'browser-source-map-support.js',
    'browser-source-map-support.mjs',
    'browser-source-map-support.d.ts',
    'index.mjs',
    'index.d.mts',
    'register.js',
    'register.d.ts',
    'register-hook-require.js',
    'register-hook-require.d.ts',
    'source-map-support.js',
    'source-map-support.d.ts',
    'source-map-support.d.cts'
  ]) assert.equal(paths.includes(required), true, `missing packed file: ${required}`)

  for (const excluded of [
    'ADOPTION_TARGETS.md',
    'CONTRIBUTING.md',
    'DEPENDENCY_DECISIONS.md',
    'ISSUE_TRIAGE.md',
    'PROJECT_MEMORY.md',
    'PUBLISHING.md',
    'REGISTRY_HANDOFF.md',
    'UPSTREAM_AUDIT.md',
    'VERIFICATION.md',
    'decision.json'
  ]) assert.equal(paths.includes(excluded), false, `private file was packed: ${excluded}`)
  assert.equal(paths.some((file) => file.startsWith('test/')), false)
  assert.equal(paths.some((file) => file.startsWith('scripts/')), false)
  assert.equal(paths.some((file) => file.startsWith('.github/')), false)

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/source-map-support': `file:${tarball}`
    }
  }))
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])

  run(process.execPath, ['--input-type=commonjs', '-e', [
    "const api = require('@stackline/source-map-support')",
    "const deep = require('@stackline/source-map-support/source-map-support')",
    "const browser = require('@stackline/source-map-support/browser-source-map-support')",
    "const expected = ['getErrorSource','install','mapSourcePosition','resetRetrieveHandlers','retrieveSourceMap','wrapCallSite']",
    "if (JSON.stringify(Object.keys(api).sort()) !== JSON.stringify(expected)) process.exit(1)",
    "if (deep !== api || typeof browser.install !== 'function') process.exit(1)",
    "api.install({handleUncaughtExceptions:false,overrideRetrieveSourceMap:true,retrieveSourceMap:s=>({url:s,map:{version:3,sources:['input.ts'],names:[],mappings:'AAAA'}})})",
    "if (!/input[.]ts$/.test(api.mapSourcePosition({source:'packed://generated.js',line:1,column:0}).source)) process.exit(1)",
    "api.resetRetrieveHandlers()",
    "api.install({handleUncaughtExceptions:false,overrideRetrieveSourceMap:true,retrieveSourceMap:s=>s==='https://example.test/sectioned.js'?{url:'https://example.test/maps/sectioned.js.map',map:{version:3,sections:[{offset:{line:0,column:0},map:{version:3,names:['firstOriginalName'],sources:['first.ts'],sourcesContent:['first source line'],mappings:'AAAAA'}},{offset:{line:2,column:5},map:{version:3,names:['secondOriginalName'],sources:['second.ts'],sourcesContent:['second source line'],mappings:'AAAAA'}}]}}:null})",
    "const section=api.mapSourcePosition({source:'https://example.test/sectioned.js',line:3,column:5})",
    "if(section.source!=='https://example.test/maps/second.ts'||section.line!==1||section.column!==0||section.name!=='secondOriginalName')process.exit(1)",
    "if(!/second source line/.test(api.getErrorSource({stack:'Error: sectioned\\n    at second ('+section.source+':1:1)\\n'})))process.exit(1)"
  ].join(';')])
  run(process.execPath, ['--input-type=commonjs', '-e', [
    "require('@stackline/source-map-support/register')",
    "if (typeof Error.prepareStackTrace !== 'function') process.exit(1)"
  ].join(';')])
  run(process.execPath, ['--input-type=commonjs', '-e', [
    "require('@stackline/source-map-support/register-hook-require')",
    "if (!require('module').prototype._compile.__sourceMapSupport) process.exit(1)"
  ].join(';')])

  await writeFile(path.join(temporary, 'consumer.mjs'), [
    "import api, { install, mapSourcePosition } from '@stackline/source-map-support'",
    "if (api.install !== install || api.mapSourcePosition !== mapSourcePosition) process.exit(1)"
  ].join('\n'))
  run(process.execPath, ['consumer.mjs'])

  const legacy = path.join(temporary, 'legacy')
  run(process.execPath, ['-e', "require('fs').mkdirSync('legacy')"])
  await writeFile(path.join(legacy, 'package.json'), JSON.stringify({
    private: true,
    dependencies: { 'source-map-support': `file:${tarball}` }
  }))
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], legacy)
  run(process.execPath, ['-e', [
    "const api=require('source-map-support')",
    "require('source-map-support/register')",
    "if(typeof api.install!=='function'||typeof Error.prepareStackTrace!=='function')process.exit(1)"
  ].join(';')], legacy)

  const installed = path.join(temporary, 'node_modules', '@stackline', 'source-map-support')
  const installedManifest = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'))
  assert.deepEqual(installedManifest.dependencies, { '@jridgewell/trace-mapping': 'npm:@stackline/trace-mapping@1.0.0' })
  assert.deepEqual(installedManifest.browser, {
    './source-map-support.js': './browser-source-map-support.js'
  })
  for (const [name, version] of [
    ['@jridgewell/trace-mapping', '1.0.0'],
    ['@jridgewell/resolve-uri', '3.1.2'],
    ['@jridgewell/sourcemap-codec', '1.6.0']
  ]) {
    const manifest = JSON.parse(await readFile(path.join(temporary, 'node_modules', ...name.split('/'), 'package.json'), 'utf8'))
    assert.equal(manifest.version, version)
  }
} finally {
  if (tarball) await rm(tarball, { force: true })
  await rm(temporary, { force: true, recursive: true })
}

console.log('Packed scoped, legacy-key, CJS, ESM, deep-entry, browser, sectioned-map, inventory, and exact production graph passed.')
