import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { chmod, copyFile, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
const runtimePath = fileURLToPath(new URL('source-map-support.js', root))

for (const file of [
  'source-map-support.js',
  'register.js',
  'register-hook-require.js',
  'index.mjs',
  'examples/commonjs.cjs',
  'examples/esm.mjs',
  'test/runtime-compat.cjs'
]) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], {
    stdio: 'inherit'
  })
}

assert.deepEqual(manifest.dependencies, {
  '@jridgewell/trace-mapping': '0.3.31'
})
assert.equal(Object.keys(manifest.optionalDependencies || {}).length, 0)
assert.equal(Object.keys(manifest.peerDependencies || {}).length, 0)

for (const [source, destination] of [
  ['node_modules/@jridgewell/trace-mapping/LICENSE', 'LICENSES/jridgewell-trace-mapping-MIT.txt'],
  ['node_modules/@jridgewell/resolve-uri/LICENSE', 'LICENSES/jridgewell-resolve-uri-MIT.txt'],
  ['node_modules/@jridgewell/sourcemap-codec/LICENSE', 'LICENSES/jridgewell-sourcemap-codec-MIT.txt'],
  ['node_modules/path-browserify/LICENSE', 'LICENSES/path-browserify-MIT.txt']
]) {
  await copyFile(new URL(source, root), new URL(destination, root))
  await chmod(new URL(destination, root), 0o644)
}

const emptyFsPlugin = {
  name: 'empty-fs',
  setup (builder) {
    builder.onResolve({ filter: /^fs$/ }, () => ({ path: 'fs', namespace: 'stackline-empty' }))
    builder.onLoad({ filter: /.*/, namespace: 'stackline-empty' }, () => ({
      contents: 'module.exports = {}',
      loader: 'js'
    }))
  }
}

const browserPathPlugin = {
  name: 'stackline-process-free-browser-path',
  setup (builder) {
    builder.onResolve({ filter: /^path$/ }, () => ({
      namespace: 'stackline-browser-path',
      path: 'path'
    }))
    builder.onLoad({ filter: /.*/, namespace: 'stackline-browser-path' }, () => ({
      contents: [
        "var path = require('path-browserify')",
        'exports.dirname = path.dirname',
        'exports.resolve = function () {',
        "  var args = ['/']",
        '  for (var i = 0; i < arguments.length; i++) args.push(arguments[i])',
        '  return path.resolve.apply(path, args)',
        '}'
      ].join('\n'),
      loader: 'js',
      resolveDir: fileURLToPath(root)
    }))
  }
}

const rawRuntimePlugin = {
  name: 'stackline-raw-runtime',
  setup (builder) {
    builder.onResolve({ filter: /^stackline:raw-runtime$/ }, () => ({ path: runtimePath }))
  }
}

const result = await build({
  bundle: true,
  entryPoints: [fileURLToPath(new URL('source-map-support.js', root))],
  format: 'cjs',
  legalComments: 'eof',
  minify: true,
  platform: 'browser',
  plugins: [browserPathPlugin, emptyFsPlugin],
  target: ['es2015'],
  write: false
})

const esmHost = (await readFile(new URL('index.mjs', root), 'utf8'))
  .replace("'./source-map-support.js'", "'stackline:raw-runtime'")
assert.match(esmHost, /stackline:raw-runtime/)

const esmResult = await build({
  absWorkingDir: fileURLToPath(root),
  bundle: true,
  format: 'esm',
  legalComments: 'eof',
  minify: true,
  platform: 'browser',
  plugins: [rawRuntimePlugin, browserPathPlugin, emptyFsPlugin],
  stdin: {
    contents: esmHost,
    loader: 'js',
    resolveDir: fileURLToPath(root),
    sourcefile: 'browser-esm-host.mjs'
  },
  target: ['es2015'],
  write: false
})

const bundled = result.outputFiles[0].text
const banner = `/*!
 * @stackline/source-map-support v${manifest.version}
 * Runtime Copyright (c) 2014 Evan Wallace, MIT.
 * CallSiteToString includes V8-derived BSD-3-Clause code; see NOTICE.
 */`
const browser = `${banner}
(function (root, factory) {
  if (typeof define === 'function') define('browser-source-map-support', factory)
  else if (typeof module === 'object' && module.exports) module.exports = factory()
  else root.sourceMapSupport = factory()
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var module = { exports: {} }
  var exports = module.exports
${bundled}
  return module.exports
}));
`

await writeFile(new URL('browser-source-map-support.js', root), browser, 'utf8')
await writeFile(new URL('browser-source-map-support.mjs', root), `${banner}\n${esmResult.outputFiles[0].text}`, 'utf8')
await chmod(new URL('browser-source-map-support.js', root), 0o644)
await chmod(new URL('browser-source-map-support.mjs', root), 0o644)
console.log(`Built historical UMD global/AMD entry (${Buffer.byteLength(browser)} bytes) and browser ESM host.`)
