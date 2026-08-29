# Changelog

## 1.0.0

- Continue the complete `source-map-support@0.5.21` CommonJS, deep-entry,
  browser, hook, map, VM, and Error-formatting contract.
- Add a compatible ESM host and first-party TypeScript 3.9 declarations.
- Move synchronous mapping to exact-pinned `@jridgewell/trace-mapping`.
- Stop retaining inspected generated files that have no map.
- Isolate malformed map failures and use prototype-safe caches.
- Preserve `Error.cause`, existing nonzero process exit codes, and modern
  top-level stack excerpts.
- Restore Evan Wallace's MIT text and the copied-V8 BSD-3-Clause attribution.
- Add current CI, CodeQL, package/type/browser/runtime/consumer gates, public
  docs, CycloneDX SBOM generation, and hashed artifact tooling.
