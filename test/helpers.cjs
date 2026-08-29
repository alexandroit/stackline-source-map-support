'use strict'

const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

function map (options) {
  options = options || {}
  return {
    version: 3,
    file: options.file || 'generated.js',
    names: options.names || [],
    sourceRoot: options.sourceRoot,
    sources: options.sources || ['original.ts'],
    sourcesContent: options.sourcesContent,
    mappings: options.mappings || 'AAAA'
  }
}

function inlineMap (value) {
  return 'data:application/json;charset=utf-8;base64,' +
    Buffer.from(JSON.stringify(value)).toString('base64')
}

function temporaryDirectory (name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), name))
}

function runNode (args, options) {
  return spawnSync(process.execPath, args, {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    ...options
  })
}

module.exports = { inlineMap, map, runNode, temporaryDirectory }
