import sourceMapSupport = require('./source-map-support.js')

export type CallSite = sourceMapSupport.CallSite
export type Environment = sourceMapSupport.Environment
export type InstallOptions = sourceMapSupport.InstallOptions
export type Options = sourceMapSupport.Options
export type Position = sourceMapSupport.Position
export type SourceMapPayload = sourceMapSupport.SourceMapPayload
export type State = sourceMapSupport.State
export type UrlAndMap = sourceMapSupport.UrlAndMap

export const install: typeof sourceMapSupport.install
export const wrapCallSite: typeof sourceMapSupport.wrapCallSite
export const getErrorSource: typeof sourceMapSupport.getErrorSource
export const mapSourcePosition: typeof sourceMapSupport.mapSourcePosition
export const retrieveSourceMap: typeof sourceMapSupport.retrieveSourceMap
export const resetRetrieveHandlers: typeof sourceMapSupport.resetRetrieveHandlers

export default sourceMapSupport
