import sourceMapSupport, { install } from '@stackline/source-map-support'

install({ handleUncaughtExceptions: false })
console.log(sourceMapSupport.install === install)
