'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')
const { inlineMap, map, runNode, temporaryDirectory } = require('./helpers.cjs')

const root = path.resolve(__dirname, '..')

test('CommonJS root preserves the upstream API', () => {
  const api = require('../source-map-support')
  assert.deepEqual(Object.keys(api).sort(), [
    'getErrorSource',
    'install',
    'mapSourcePosition',
    'resetRetrieveHandlers',
    'retrieveSourceMap',
    'wrapCallSite'
  ])
  for (const value of Object.values(api)) assert.equal(typeof value, 'function')
})

test('custom retrieveSourceMap maps names, URLs, sourceRoot, and sourcesContent', () => {
  const api = require('../source-map-support')
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (source) {
      if (source !== 'https://example.test/assets/generated.js') return null
      return {
        url: 'https://example.test/assets/maps/generated.js.map',
        map: map({
          names: ['originalName'],
          sourceRoot: '../src',
          sources: ['input.ts'],
          sourcesContent: ['throw new Error("mapped")'],
          mappings: 'AAAAA'
        })
      }
    }
  })

  const mapped = api.mapSourcePosition({
    source: 'https://example.test/assets/generated.js',
    line: 1,
    column: 0
  })
  assert.equal(mapped.source, 'https://example.test/assets/src/input.ts')
  assert.equal(mapped.line, 1)
  assert.equal(mapped.column, 0)
  assert.equal(mapped.name, 'originalName')
})

test('hookRequire preserves runtime-transpiler inline maps', () => {
  const directory = temporaryDirectory('stackline-sms-hook-')
  const filename = path.join(directory, 'generated.cjs')
  const original = 'export function fail() { throw new Error("hooked") }'
  const code = [
    'module.exports = function fail () { throw new Error("hooked") }',
    `//# sourceMappingURL=${inlineMap(map({ sources: ['hooked.ts'], sourcesContent: [original] }))}`
  ].join('\n')
  fs.writeFileSync(filename, code)

  try {
    const api = require('../source-map-support')
    api.resetRetrieveHandlers()
    api.install({ handleUncaughtExceptions: false, hookRequire: true })
    const fail = require(filename)
    assert.throws(fail, (error) => {
      assert.match(error.stack, new RegExp(path.join(directory, 'hooked.ts').replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')))
      return true
    })
  } finally {
    fs.rmSync(directory, { force: true, recursive: true })
  }
})

test('getErrorSource returns the mapped source excerpt', () => {
  const api = require('../source-map-support')
  const generated = 'https://example.test/get-error-source.js'
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (source) {
      if (source !== generated) return null
      return {
        url: generated,
        map: map({
          sources: ['original.ts'],
          sourcesContent: ['throw new Error("excerpt")']
        })
      }
    }
  })

  let error
  try {
    vm.runInThisContext('throw new Error("excerpt")', { filename: generated })
  } catch (caught) {
    error = caught
  }
  assert.match(error.stack, /https:\/\/example\.test\/original\.ts:1:1/)
  assert.equal(api.getErrorSource(error), [
    'https://example.test/original.ts:1',
    'throw new Error("excerpt")',
    '^'
  ].join('\n'))
})

test('historical deep registration entries install their documented hooks', () => {
  const register = runNode(['-e', [
    `require(${JSON.stringify(path.join(root, 'register.js'))})`,
    "if (typeof Error.prepareStackTrace !== 'function') process.exit(1)"
  ].join(';')])
  assert.equal(register.status, 0, register.stderr)

  const hook = runNode(['-e', [
    `require(${JSON.stringify(path.join(root, 'register-hook-require.js'))})`,
    "const Module = require('module')",
    "if (!Module.prototype._compile.__sourceMapSupport) process.exit(1)"
  ].join(';')])
  assert.equal(hook.status, 0, hook.stderr)
})

test('unknown environment retains the upstream validation contract', () => {
  const api = require('../source-map-support')
  assert.throws(
    () => api.install({ environment: 'worker' }),
    /environment worker was unknown\. Available options are \{auto, browser, node\}/
  )
})
