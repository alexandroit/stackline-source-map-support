import sourceMapSupport, {
  install,
  mapSourcePosition,
  resetRetrieveHandlers,
  wrapCallSite
} from '../../index.mjs'
import type {
  Environment,
  Options,
  State,
  UrlAndMap
} from '../../index.mjs'

const environment: Environment = 'browser'
const options: Options = {
  environment,
  handleUncaughtExceptions: false,
  retrieveSourceMap: (_source) => ({
    map: '{"version":3,"sources":[],"names":[],"mappings":""}'
  })
}
install(options)

const mapped = mapSourcePosition({ source: 'generated.js', line: 1, column: 0 })
mapped.source.toUpperCase()
resetRetrieveHandlers()
sourceMapSupport.install()

declare const frame: sourceMapSupport.CallSite
const state: State = {
  nextPosition: null,
  curPosition: null
}
wrapCallSite(frame, state)
const urlAndMap: UrlAndMap = {
  map: { version: 3, sources: [], names: [], mappings: '' }
}
void urlAndMap
