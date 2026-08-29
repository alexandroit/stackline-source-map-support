import sourceMapSupport = require('../../source-map-support.js')
import '../../register.js'
import '../../register-hook-require.js'

sourceMapSupport.install({
  environment: 'auto',
  handleUncaughtExceptions: false
})

const mapped = sourceMapSupport.mapSourcePosition({
  source: 'generated.js',
  line: 1,
  column: 0
})
mapped.source.toUpperCase()
