import sourceMapSupport from './source-map-support.js'

export const install = sourceMapSupport.install
export const wrapCallSite = sourceMapSupport.wrapCallSite
export const getErrorSource = sourceMapSupport.getErrorSource
export const mapSourcePosition = sourceMapSupport.mapSourcePosition
export const retrieveSourceMap = sourceMapSupport.retrieveSourceMap
export const resetRetrieveHandlers = sourceMapSupport.resetRetrieveHandlers

export default sourceMapSupport
