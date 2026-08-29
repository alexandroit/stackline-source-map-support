import sourceMapSupport = require('../..')
import type {
  Environment,
  Options,
  State,
  UrlAndMap
} from '../..'
import '../../register'
import '../../register-hook-require'

const environment: Environment = 'node'
const options: Options = {
  environment,
  emptyCacheBetweenOperations: true,
  handleUncaughtExceptions: false,
  hookRequire: true,
  overrideRetrieveFile: true,
  overrideRetrieveSourceMap: true,
  retrieveFile: (path: string) => path,
  retrieveSourceMap: (_source: string) => ({
    map: { version: 3, sources: [], names: [], mappings: '' }
  })
}

sourceMapSupport.install(options)
const position: sourceMapSupport.Position = {
  source: 'generated.js',
  line: 1,
  column: 0
}
const mapped: sourceMapSupport.Position = sourceMapSupport.mapSourcePosition(position)
const payload: sourceMapSupport.SourceMapPayload | null = sourceMapSupport.retrieveSourceMap(mapped.source)
void payload
const urlAndMap: UrlAndMap = {
  map: { version: 3, sources: [], names: [], mappings: '' }
}
void urlAndMap

declare const frame: sourceMapSupport.CallSite
const state: State = {
  nextPosition: null,
  curPosition: null
}
sourceMapSupport.wrapCallSite(frame, state)
