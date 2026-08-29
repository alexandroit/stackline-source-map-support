'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const { temporaryDirectory } = require('./helpers.cjs')

test('generated files without maps are not retained in the content cache', () => {
  assert.equal(typeof global.gc, 'function', 'run with --expose-gc')
  const api = require('../source-map-support')
  const directory = temporaryDirectory('stackline-sms-memory-')
  api.resetRetrieveHandlers()
  global.gc()
  const baseline = process.memoryUsage().heapUsed

  try {
    for (let index = 0; index < 32; index++) {
      const filename = path.join(directory, `generated-${index}.js`)
      const marker = String(index).padStart(8, '0')
      fs.writeFileSync(filename, marker + 'x'.repeat(1024 * 1024 - marker.length))
      api.mapSourcePosition({ source: filename, line: 1, column: 0 })
      fs.unlinkSync(filename)
    }
    global.gc()
    const retained = process.memoryUsage().heapUsed - baseline
    assert.ok(retained < 16 * 1024 * 1024, `unexpected retained heap: ${retained}`)
  } finally {
    fs.rmSync(directory, { force: true, recursive: true })
  }
})
