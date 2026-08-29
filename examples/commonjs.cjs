const sourceMapSupport = require('@stackline/source-map-support')

sourceMapSupport.install({ handleUncaughtExceptions: false })
console.log(typeof sourceMapSupport.mapSourcePosition)
