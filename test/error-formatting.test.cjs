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
