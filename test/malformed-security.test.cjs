'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const { temporaryDirectory, runNode } = require('./helpers.cjs')

test('malformed map JSON falls back to the generated position and is cached', () => {
  const api = require('../source-map-support')
  const source = `malformed://${process.pid}/generated.js`
  let retrievals = 0
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (name) {
      if (name !== source) return null
      retrievals++
      return { url: source, map: '{not-json' }
    }
  })

  const position = { source, line: 7, column: 11 }
  assert.deepEqual(api.mapSourcePosition(position), position)
  assert.deepEqual(api.mapSourcePosition(position), position)
  assert.equal(retrievals, 1)
})

test('throwing map accessors do not replace application stack failures', () => {
  const api = require('../source-map-support')
  const source = `getter://${process.pid}/generated.js`
  const payload = { url: source }
  Object.defineProperty(payload, 'map', {
    get () { throw new Error('hostile getter') }
  })
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap: () => payload
  })
  const position = { source, line: 1, column: 0 }
  assert.doesNotThrow(() => api.mapSourcePosition(position))
  assert.deepEqual(api.mapSourcePosition(position), position)
})

test('special object keys do not collide with cache prototypes', () => {
  const api = require('../source-map-support')
  let retrievals = 0
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap () {
      retrievals++
      return null
    }
  })
  for (const source of ['__proto__', 'constructor', 'toString']) {
    const position = { source, line: 1, column: 0 }
    assert.deepEqual(api.mapSourcePosition(position), position)
  }
  assert.equal(retrievals, 3)
  assert.equal(Object.prototype.polluted, undefined)
})

test('invalid inline base64 maps fail closed without corrupting Error.stack', () => {
  const api = require('../source-map-support')
  const directory = temporaryDirectory('stackline-sms-malformed-')
  const filename = path.join(directory, 'generated.js')
  fs.writeFileSync(filename, 'throw new Error("original failure")\n//# sourceMappingURL=data:application/json;base64,%%%')
  try {
    api.resetRetrieveHandlers()
    api.install({ handleUncaughtExceptions: false })
    delete require.cache[filename]
    assert.throws(() => require(filename), (error) => {
      assert.match(error.stack, /Error: original failure/)
      assert.match(error.stack, /generated\.js:1/)
      return true
    })
  } finally {
    delete require.cache[filename]
    fs.rmSync(directory, { force: true, recursive: true })
  }
})

test('long non-matching sourceMappingURL input remains bounded', () => {
  const api = require('../source-map-support')
  const directory = temporaryDirectory('stackline-sms-long-')
  const filename = path.join(directory, 'generated.js')
  fs.writeFileSync(filename, `${'x'.repeat(2 * 1024 * 1024)}\n//# sourceMappingURL=${'x'.repeat(512 * 1024)} `)
  const started = Date.now()
  try {
    api.resetRetrieveHandlers()
    api.mapSourcePosition({ source: filename, line: 1, column: 0 })
    assert.ok(Date.now() - started < 5000, 'source-map scan exceeded five seconds')
  } finally {
    fs.rmSync(directory, { force: true, recursive: true })
  }
})

test('malformed stack frame parsing is bounded for repeated openings and digit suffixes', () => {
  const child = runNode(['-e', [
    `const api = require(${JSON.stringify(path.resolve(__dirname, '../source-map-support.js'))})`,
    "for (const frame of ['a ('.repeat(80000) + 'missing:1', 'path:' + '1'.repeat(240000) + ':x']) { if (api.getErrorSource({ stack: 'Error: hostile\\n    at ' + frame }) !== null) process.exit(2) }"
  ].join(';')], { timeout: 5000 })
  assert.equal(child.error, undefined, String(child.error))
  assert.equal(child.status, 0, child.stderr)
})
