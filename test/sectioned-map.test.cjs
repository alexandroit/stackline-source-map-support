'use strict'

const assert = require('node:assert/strict')
const test = require('node:test')

const maintained = require('../source-map-support')
const upstream = require('source-map-support-upstream')

function sectionedMap () {
  return {
    version: 3,
    file: 'bundle.js',
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

function exercise (api, generated) {
  const mapUrl = 'https://example.test/maps/bundle.js.map'
  api.resetRetrieveHandlers()
  api.install({
    handleUncaughtExceptions: false,
    overrideRetrieveSourceMap: true,
    retrieveSourceMap (source) {
      if (source !== generated) return null
      return { url: mapUrl, map: sectionedMap() }
    }
  })

  // source-map@0.6's indexed consumer applies section columns one character
  // late. Query inside each mapped segment so the maintained result can be
  // compared directly with the historical package while separate browser
  // tests assert the exact section boundary.
  const first = api.mapSourcePosition({ source: generated, line: 1, column: 1 })
  const second = api.mapSourcePosition({ source: generated, line: 3, column: 6 })
  return {
    first,
    firstSource: api.getErrorSource({
      stack: `Error: first\n    at first (${first.source}:${first.line}:${first.column + 1})\n`
    }),
    second,
    secondSource: api.getErrorSource({
      stack: `Error: second\n    at second (${second.source}:${second.line}:${second.column + 1})\n`
    })
  }
}

test('indexed Source Map v3 sections preserve upstream offsets/names and embedded sourcesContent', () => {
  const upstreamResult = exercise(upstream, `sectioned-upstream://${process.pid}/bundle.js`)
  const maintainedResult = exercise(maintained, `sectioned-maintained://${process.pid}/bundle.js`)

  assert.deepEqual(maintainedResult.first, upstreamResult.first)
  assert.deepEqual(maintainedResult.second, upstreamResult.second)
  // The old indexed consumer exposes sourceContentFor() but not the
  // sourcesContent property used by source-map-support, so its excerpt is
  // absent. AnyMap flattens indexed maps and preserves embedded content.
  assert.equal(upstreamResult.firstSource, null)
  assert.equal(upstreamResult.secondSource, null)
  assert.deepEqual(maintainedResult, {
    first: {
      source: 'https://example.test/maps/first.ts',
      line: 1,
      column: 0,
      name: 'firstOriginalName'
    },
    firstSource: 'https://example.test/maps/first.ts:1\nfirst source line\n^',
    second: {
      source: 'https://example.test/maps/second.ts',
      line: 1,
      column: 0,
      name: 'secondOriginalName'
    },
    secondSource: 'https://example.test/maps/second.ts:1\nsecond source line\n^'
  })
})
