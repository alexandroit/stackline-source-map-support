import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { parse } from 'acorn'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const source = await readFile(new URL('../browser-source-map-support.js', import.meta.url), 'utf8')
const upstreamSource = await readFile(new URL('../node_modules/source-map-support-upstream/browser-source-map-support.js', import.meta.url), 'utf8')
parse(source, { ecmaVersion: 2015, sourceType: 'script' })
const esmSource = await readFile(new URL('../browser-source-map-support.mjs', import.meta.url), 'utf8')
parse(esmSource, { ecmaVersion: 2015, sourceType: 'module' })
const expected = [
  'getErrorSource',
  'install',
  'mapSourcePosition',
  'resetRetrieveHandlers',
  'retrieveSourceMap',
  'wrapCallSite'
]

function assertApi (api) {
  assert.deepEqual(Object.keys(api).sort(), expected)
  api.resetRetrieveHandlers()
  api.install({
    environment: 'browser',
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (sourceName) {
      if (sourceName === 'https://example.test/app.js') {
        return {
          url: sourceName,
          map: {
            version: 3,
            file: 'app.js',
            names: [],
            sources: ['input.ts'],
            sourcesContent: ['throw new Error("mapped")'],
            mappings: 'AAAA'
          }
        }
      }
      if (sourceName === 'https://example.test/sectioned.js') {
        return {
          url: 'https://example.test/maps/sectioned.js.map',
          map: {
            version: 3,
            file: 'sectioned.js',
            sections: [
              {
                offset: { line: 0, column: 0 },
                map: {
                  version: 3,
                  names: ['firstOriginalName'],
                  sources: ['first.ts'],
                  sourcesContent: ['first source line'],
                  mappings: 'AAAAA'
                }
              },
              {
                offset: { line: 2, column: 5 },
                map: {
                  version: 3,
                  names: ['secondOriginalName'],
                  sources: ['second.ts'],
                  sourcesContent: ['second source line'],
                  mappings: 'AAAAA'
                }
              }
            ]
          }
        }
      }
      return null
    }
  })
  const mapped = api.mapSourcePosition({
    source: 'https://example.test/app.js',
    line: 1,
    column: 0
  })
  assert.equal(mapped.source, 'https://example.test/input.ts')
  assert.equal(mapped.line, 1)
  assert.equal(mapped.column, 0)

  const firstSection = api.mapSourcePosition({
    source: 'https://example.test/sectioned.js',
    line: 1,
    column: 0
  })
  assert.deepEqual(JSON.parse(JSON.stringify(firstSection)), {
    source: 'https://example.test/maps/first.ts',
    line: 1,
    column: 0,
    name: 'firstOriginalName'
  })
  const secondSection = api.mapSourcePosition({
    source: 'https://example.test/sectioned.js',
    line: 3,
    column: 5
  })
  assert.deepEqual(JSON.parse(JSON.stringify(secondSection)), {
    source: 'https://example.test/maps/second.ts',
    line: 1,
    column: 0,
    name: 'secondOriginalName'
  })
  assert.equal(api.getErrorSource({
    stack: `Error: sectioned\n    at second (${secondSection.source}:1:1)\n`
  }), 'https://example.test/maps/second.ts:1\nsecond source line\n^')
}

function relativeMapResult (api) {
  api.resetRetrieveHandlers()
  api.install({
    environment: 'browser',
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (sourceName) {
      if (sourceName !== 'generated.js') return null
      return {
        url: 'generated.js.map',
        map: {
          version: 3,
          file: 'generated.js',
          names: [],
          sources: ['input.ts'],
          sourcesContent: ['relative source line'],
          mappings: 'AAAA'
        }
      }
    }
  })
  return JSON.parse(JSON.stringify(api.mapSourcePosition({
    source: 'generated.js',
    line: 1,
    column: 0
  })))
}

function malformedInlineResult (api) {
  api.resetRetrieveHandlers()
  api.install({
    environment: 'browser',
    handleUncaughtExceptions: false,
    overrideRetrieveFile: true,
    retrieveFile (sourceName) {
      if (sourceName !== 'malformed-inline.js') return ''
      return 'throw new Error()\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,%%%'
    }
  })
  return JSON.parse(JSON.stringify(api.mapSourcePosition({
    source: 'malformed-inline.js',
    line: 1,
    column: 0
  })))
}

function browserContext () {
  const context = {
    TextDecoder,
    Uint8Array,
    URL,
    atob: globalThis.atob.bind(globalThis),
    console
  }
  context.globalThis = context
  context.window = context
  return context
}

const commonjs = require('../browser-source-map-support.js')
assertApi(commonjs)

const globalContext = browserContext()
vm.runInNewContext(source, globalContext, { filename: 'browser-source-map-support.js' })
assertApi(globalContext.sourceMapSupport)

let amdName
let amdFactory
const amdContext = { ...globalContext }
amdContext.define = (name, factory) => {
  amdName = name
  amdFactory = factory
}
amdContext.define.amd = {}
amdContext.globalThis = amdContext
amdContext.window = amdContext
delete amdContext.sourceMapSupport
vm.runInNewContext(source, amdContext, { filename: 'browser-source-map-support.js' })
assert.equal(amdName, 'browser-source-map-support')
assert.equal(typeof amdFactory, 'function')
assert.equal(amdContext.sourceMapSupport, undefined)
assertApi(amdFactory())

const browserModule = await import(`data:text/javascript;base64,${Buffer.from(esmSource).toString('base64')}`)
assert.equal(browserModule.default.install, browserModule.install)
assert.equal(browserModule.default.mapSourcePosition, browserModule.mapSourcePosition)
assertApi(browserModule.default)

const upstreamContext = browserContext()
vm.runInNewContext(upstreamSource, upstreamContext, { filename: 'upstream-browser-source-map-support.js' })
const upstreamRelative = relativeMapResult(upstreamContext.sourceMapSupport)
assert.deepEqual(upstreamRelative, {
  source: '/input.ts',
  line: 1,
  column: 0,
  name: null
})
const malformedPosition = {
  source: 'malformed-inline.js',
  line: 1,
  column: 0
}
assert.deepEqual(malformedInlineResult(upstreamContext.sourceMapSupport), malformedPosition)
assert.deepEqual(relativeMapResult(globalContext.sourceMapSupport), upstreamRelative)
assert.deepEqual(malformedInlineResult(globalContext.sourceMapSupport), malformedPosition)

const browserEsmForVm = await build({
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  stdin: {
    contents: "import api from './browser-source-map-support.mjs'; globalThis.__stacklineBrowserEsm = api",
    loader: 'js',
    resolveDir: fileURLToPath(new URL('../', import.meta.url))
  },
  target: ['es2015'],
  write: false
})
const esmVmContext = browserContext()
vm.runInNewContext(browserEsmForVm.outputFiles[0].text, esmVmContext, { filename: 'browser-esm-consumer.js' })
assertApi(esmVmContext.__stacklineBrowserEsm)
assert.deepEqual(relativeMapResult(esmVmContext.__stacklineBrowserEsm), upstreamRelative)
assert.deepEqual(malformedInlineResult(esmVmContext.__stacklineBrowserEsm), malformedPosition)

const bundledRoot = await build({
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  bundle: true,
  format: 'iife',
  metafile: true,
  platform: 'browser',
  stdin: {
    contents: "globalThis.__stacklineRoot = require('@stackline/source-map-support')",
    loader: 'js',
    resolveDir: fileURLToPath(new URL('../', import.meta.url))
  },
  target: ['es2015'],
  write: false
})
const bundledInputs = Object.keys(bundledRoot.metafile.inputs)
assert.equal(bundledInputs.some((name) => name.endsWith('browser-source-map-support.js')), true)
assert.equal(bundledInputs.some((name) => /(^|\/)source-map-support\.js$/.test(name) && !name.endsWith('browser-source-map-support.js')), false)
const remapContext = browserContext()
vm.runInNewContext(bundledRoot.outputFiles[0].text, remapContext, { filename: 'bundled-root.js' })
assertApi(remapContext.__stacklineRoot)

const bundledImport = await build({
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  bundle: true,
  format: 'esm',
  metafile: true,
  platform: 'browser',
  stdin: {
    contents: "import api, { install } from '@stackline/source-map-support'; if (api.install !== install) throw new Error('browser ESM mismatch')",
    loader: 'js',
    resolveDir: fileURLToPath(new URL('../', import.meta.url))
  },
  target: ['es2015'],
  write: false
})
const importInputs = Object.keys(bundledImport.metafile.inputs)
assert.equal(importInputs.some((name) => name.endsWith('browser-source-map-support.mjs')), true)
assert.equal(importInputs.some((name) => /(^|\/)source-map-support\.js$/.test(name) && !name.endsWith('browser-source-map-support.js')), false)

console.log('Browser UMD/ESM process-free relative-path and malformed-inline differentials, CommonJS/global/named-AMD, ES2015, additive root routing, hook, regular-map, and sectioned-map contracts passed.')
