import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import sourceMapSupport, {
  getErrorSource,
  install,
  mapSourcePosition,
  resetRetrieveHandlers,
  retrieveSourceMap,
  wrapCallSite
} from '../index.mjs'

const require = createRequire(import.meta.url)
assert.equal(sourceMapSupport, require('../source-map-support.js'))
assert.equal(install, sourceMapSupport.install)
assert.equal(wrapCallSite, sourceMapSupport.wrapCallSite)
assert.equal(getErrorSource, sourceMapSupport.getErrorSource)
assert.equal(mapSourcePosition, sourceMapSupport.mapSourcePosition)
assert.equal(retrieveSourceMap, sourceMapSupport.retrieveSourceMap)
assert.equal(resetRetrieveHandlers, sourceMapSupport.resetRetrieveHandlers)

console.log('ESM host default and named export contracts passed.')
