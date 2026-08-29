export = sourceMapSupport
export as namespace sourceMapSupport

declare namespace sourceMapSupport {
  interface Position {
    source: string
    line: number
    column: number
    name?: string | null
  }

  interface UrlAndMap {
    url?: string
    map: string | object
  }

  interface SourceMapPayload extends UrlAndMap {}

  type Environment = 'auto' | 'browser' | 'node'

  interface State {
    nextPosition: Position | null
    curPosition: Position | null
  }

  type RetrieveFile = (path: string) => string | null | undefined
  type RetrieveSourceMap = (source: string) => UrlAndMap | null | undefined

  interface Options {
    environment?: Environment
    retrieveFile?: RetrieveFile
    overrideRetrieveFile?: boolean
    retrieveSourceMap?: RetrieveSourceMap
    overrideRetrieveSourceMap?: boolean
    hookRequire?: boolean
    emptyCacheBetweenOperations?: boolean
    handleUncaughtExceptions?: boolean
  }

  interface InstallOptions extends Options {}

  interface CallSite {
    getThis(): any
    getTypeName(): string | null
    getFunction(): Function | undefined
    getFunctionName(): string | null
    getMethodName(): string | null
    getFileName(): string | null
    getLineNumber(): number | null
    getColumnNumber(): number | null
    getEvalOrigin(): string | undefined
    getScriptNameOrSourceURL?(): string
    isToplevel(): boolean
    isEval(): boolean
    isNative(): boolean
    isConstructor(): boolean
    isAsync?(): boolean
    isPromiseAll?(): boolean
    getPromiseIndex?(): number | null
    toString(): string
  }

  function install(options?: Options): void
  function wrapCallSite(frame: CallSite, state?: State): CallSite
  function getErrorSource(error: Error): string | null
  function mapSourcePosition(position: Position): Position
  function retrieveSourceMap(source: string): UrlAndMap | null
  function resetRetrieveHandlers(): void
}
