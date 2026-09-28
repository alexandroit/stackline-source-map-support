'use strict'

const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')
const { runNode } = require('./helpers.cjs')

const entry = path.resolve(__dirname, '../source-map-support.js')

test('uncaught Error.cause is retained and an existing nonzero exit code wins', () => {
  const child = runNode(['-e', [
    `require(${JSON.stringify(entry)}).install()`,
    'process.exitCode = 7',
    "throw new Error('outer marker', { cause: new Error('inner marker') })"
  ].join(';')])
  assert.equal(child.status, 7)
  assert.match(child.stderr, /Error: outer marker/)
  assert.match(child.stderr, /Error: inner marker/)
})

test('package retains the current native V8 differently-named property alias', () => {
  const exercise = [
    "const target = { customMethod: function doSomething () { throw new Error('alias marker') } }",
    "try { target.customMethod() } catch (error) { console.log(error.stack.split('\\n')[1]) }"
  ].join(';')
  const native = runNode(['-e', exercise])
  const installed = runNode(['-e', `require(${JSON.stringify(entry)}).install({ handleUncaughtExceptions: false });${exercise}`])
  const alias = /^\s*at Object\.doSomething \[as customMethod\] \(.+:\d+:\d+\)$/
  assert.equal(native.status, 0, native.stderr)
  assert.equal(installed.status, 0, installed.stderr)
  assert.match(native.stdout.trim(), alias)
  assert.match(installed.stdout.trim(), alias)
})

test('method aliases use an exact method name or suffix, including repeated suffixes', () => {
  const api = require('../source-map-support')
  const previous = Error.prepareStackTrace
  let frame
  try {
    Error.prepareStackTrace = (_error, frames) => frames
    frame = new Error().stack[0]
  } finally {
    Error.prepareStackTrace = previous
  }
  const override = (name, value) => Object.defineProperty(frame, name, { value: () => value, configurable: true })
  override('isToplevel', false)
  override('isConstructor', false)
  override('getTypeName', 'Object')
  for (const [functionName, methodName, alias] of [
    ['abc', 'xyz', true],
    ['bar', 'bar', false],
    ['foo.bar.bar', 'bar', false],
    ['foo.barExtra', 'bar', true],
    ['longName', 'other', true]
  ]) {
    override('getFunctionName', functionName)
    override('getMethodName', methodName)
    assert.equal(api.wrapCallSite(frame).toString().includes(` [as ${methodName}]`), alias, `${functionName} / ${methodName}`)
  }
})

test('source excerpts retain bare, named, URL and Windows locations and skip invalid frames', () => {
  const api = require('../source-map-support')
  const sources = ['/source with spaces.js', '/source(old).js', 'https://example.test/app.js', 'C:/work/app.js']
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (source) {
      return { url: source, map: { version: 3, names: [], sources: [source], sourcesContent: ['first\nsecond'], mappings: 'AAAA' } }
    }
  })
  for (const source of sources) {
    const mapped = api.mapSourcePosition({ source, line: 1, column: 0 }).source
    for (const location of [`${mapped}:2:3`, `named (${mapped}:2:3)`]) {
      assert.equal(api.getErrorSource({ stack: `Error: marker\n    at invalid:line:column\n    at ${location}\n    at later:1:1` }), `${mapped}:2\nsecond\n  ^`)
    }
  }
  for (const stack of ['', 'Error\n    at :1:1', 'Error\n    at file:1:x', 'Error\n    at file::1']) {
    assert.equal(api.getErrorSource({ stack }), null)
  }
})
