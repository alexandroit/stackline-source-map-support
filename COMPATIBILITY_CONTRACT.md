# Compatibility contract

## Preserved runtime surface

- The CommonJS root and `source-map-support.js` deep entry return the same
  six-function object as upstream 0.5.21.
- `register` installs the default stack formatter as a side effect.
- `register-hook-require` also wraps `Module.prototype._compile` for runtime
  transpilers and inline maps.
- `browser-source-map-support` remains a self-contained global, named AMD, and
  CommonJS UMD entry. The package browser remap routes the root runtime there.
- `install` preserves all historical options and handler ordering, including
  override and reset behavior.
- Inline and external maps, `sourcesContent`, `sourceRoot`, URL and file paths,
  mapped names, eval origins, VM frames, code excerpts, and native frames are
  exercised by upstream and characterization tests.
- Error formatting retains V8 CallSite conventions, custom
  `Error.prepareStackTrace` use, uncaught-handler opt-out, worker behavior, and
  existing process listeners.

## Additive surface

- `index.mjs` supplies a no-install-side-effect ESM host with a default API
  object and named functions.
- First-party declarations support TypeScript 3.9 and modern Node16/NodeNext
  resolution, including deep entries and the browser global.

## Intentional maintained differences

- The production map consumer is exact-pinned
  `@jridgewell/trace-mapping@0.3.31` and its audited MIT transitive graph.
- Generated file text is not retained after its mapping URL is inspected.
  Missing-map decisions remain cached, preserving one retrieval per source.
- Invalid map payloads cannot replace an application error with a parser
  error; they are cached as misses and use the generated position.
- Cache dictionaries have null prototypes, avoiding special-key collisions.
- Uncaught rendering passes the Error object to the console so `Error.cause`
  is visible, and preserves a preselected nonzero `process.exitCode`.
- The browser artifact requires ES2015. Upstream 0.5.21's older emitted syntax
  is not promised.

## Native boundary

Modern Node native source maps are the recommended ordinary path. The release
is justified by the tested residual contract: on the current qualification
runtime, native mapping handled a normal file but not identical external-map
code executed with `vm.runInThisContext`; this package mapped the VM frame.
