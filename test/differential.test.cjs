'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const { map, runNode, temporaryDirectory } = require('./helpers.cjs')

const entry = path.resolve(__dirname, '../source-map-support.js')

test('native maps normal files while the package fills vm.runInThisContext', () => {
  const directory = temporaryDirectory('stackline-sms-differential-')
  const generated = path.join(directory, 'generated.js')
  const original = path.join(directory, 'original.ts')
  const source = 'throw new Error("vm differential")\n//# sourceMappingURL=generated.js.map\n'
  fs.writeFileSync(generated, source)
  fs.writeFileSync(`${generated}.map`, JSON.stringify(map({
    file: 'generated.js',
    sources: ['original.ts'],
    sourcesContent: ['throw new Error("vm differential")']
  })))

  try {
    const ordinaryNative = runNode(['--enable-source-maps', generated])
    assert.notEqual(ordinaryNative.status, 0)
    assert.match(ordinaryNative.stderr, new RegExp(original.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')))

    const nativeRunner = path.join(directory, 'native-runner.cjs')
    fs.writeFileSync(nativeRunner, [
      "const fs = require('fs')",
      "const vm = require('vm')",
      "try { const mod = require('module'); if (mod.setSourceMapsSupport) mod.setSourceMapsSupport(true, { generatedCode: true }) } catch {}",
      `const filename = ${JSON.stringify(generated)}`,
      "try { vm.runInThisContext(fs.readFileSync(filename, 'utf8'), { filename }) } catch (error) { console.log(error.stack) }"
    ].join('\n'))
    const nativeVm = runNode(['--enable-source-maps', nativeRunner])
    assert.equal(nativeVm.status, 0, nativeVm.stderr)
    assert.match(nativeVm.stdout, /generated\.js:1/)
    assert.doesNotMatch(nativeVm.stdout, /original\.ts:1/)

    const packageRunner = path.join(directory, 'package-runner.cjs')
    fs.writeFileSync(packageRunner, [
      "const fs = require('fs')",
      "const vm = require('vm')",
      `require(${JSON.stringify(entry)}).install({ handleUncaughtExceptions: false })`,
      `const filename = ${JSON.stringify(generated)}`,
      "try { vm.runInThisContext(fs.readFileSync(filename, 'utf8'), { filename }) } catch (error) { console.log(error.stack) }"
    ].join('\n'))
    const packageVm = runNode([packageRunner])
    assert.equal(packageVm.status, 0, packageVm.stderr)
    assert.match(packageVm.stdout, /original\.ts:1:1/)
  } finally {
    fs.rmSync(directory, { force: true, recursive: true })
  }
})
