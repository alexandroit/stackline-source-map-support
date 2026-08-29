'use strict'

const assert = require('assert')
const api = require('../source-map-support')

assert.deepStrictEqual(Object.keys(api).sort(), [
  'getErrorSource',
  'install',
  'mapSourcePosition',
  'resetRetrieveHandlers',
  'retrieveSourceMap',
  'wrapCallSite'
])
const source = `runtime://${process.version}/generated.js`
api.resetRetrieveHandlers()
api.install({
  handleUncaughtExceptions: false,
  overrideRetrieveSourceMap: true,
  retrieveSourceMap: function (name) {
    if (name !== source) return null
    return {
      url: source,
      map: {
        version: 3,
        file: 'generated.js',
        names: [],
        sources: ['original.ts'],
        sourcesContent: ['throw new Error("runtime")'],
        mappings: 'AAAA'
      }
    }
  }
})
const mapped = api.mapSourcePosition({ source: source, line: 1, column: 0 })
assert.ok(/original[.]ts$/.test(mapped.source), mapped.source)
assert.strictEqual(mapped.line, 1)
assert.strictEqual(mapped.column, 0)
const aliasTarget = {
  customMethod: function doSomething () { throw new Error('alias runtime') }
}
let aliasError
try {
  aliasTarget.customMethod()
} catch (error) {
  aliasError = error
}
assert.ok(/at Object[.]doSomething \[as customMethod\] \(/.test(aliasError.stack), aliasError.stack)
assert.strictEqual(typeof require('../browser-source-map-support').install, 'function')
console.log(`Node ${process.version} runtime contract passed.`)
