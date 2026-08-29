'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')
const { map } = require('./helpers.cjs')

test('ten thousand cached lookups retain stable mapping results', () => {
  const api = require('../source-map-support')
  const source = `stress://${process.pid}/generated.js`
  let retrievals = 0
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (name) {
      if (name !== source) return null
      retrievals++
      return { url: source, map: map({ sources: ['input.ts'] }) }
    }
  })
  for (let index = 0; index < 10000; index++) {
    const mapped = api.mapSourcePosition({ source, line: 1, column: 0 })
    assert.match(mapped.source, /input\.ts$/)
  }
  assert.equal(retrievals, 1)
})

test('two thousand independent maps do not cross-contaminate sources', () => {
  const api = require('../source-map-support')
  const prefix = `many://${process.pid}/`
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (source) {
      if (!source.startsWith(prefix)) return null
      const id = source.slice(prefix.length, -3)
      return { url: source, map: map({ sources: [`source-${id}.ts`] }) }
    }
  })
  for (let index = 0; index < 2000; index++) {
    const mapped = api.mapSourcePosition({
      source: `${prefix}${index}.js`,
      line: 1,
      column: 0
    })
    assert.match(mapped.source, new RegExp(`source-${index}\\.ts$`))
  }
})

test('repeated install and reset preserves retrieval priority', () => {
  const api = require('../source-map-support')
  const source = `priority://${process.pid}/generated.js`
  const calls = []
  for (let index = 0; index < 100; index++) {
    api.resetRetrieveHandlers()
    api.install({
      handleUncaughtExceptions: false,
      retrieveSourceMap () {
        calls.push(index)
        return index === 99 ? { url: source, map: map() } : null
      }
    })
  }
  const mapped = api.mapSourcePosition({ source, line: 1, column: 0 })
  assert.match(mapped.source, /original\.ts$/)
  assert.equal(calls[calls.length - 1], 99)
})
