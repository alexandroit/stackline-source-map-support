# Migration

## Exact historical-key alias

Applications that already import `source-map-support` can change only their
dependency value:

```json
"source-map-support": "npm:@stackline/source-map-support@1.0.0"
```

Regenerate the lockfile with the repository's own package-manager version and
run the exact main/renderer or runtime-transpiler smoke. Do not hand-edit lock
integrity fields.

## Scoped imports

New code can use `@stackline/source-map-support`, `/register`,
`/register-hook-require`, or `/browser-source-map-support`. Extension-bearing
variants remain exported for older consumers.

## Prefer native Node when it is sufficient

Before installing a global hook in a modern Node-only application, test
`--enable-source-maps` or `node:module` source-map support. Keep this package
when the application depends on VM-generated code, browser UMD/AMD behavior,
Electron compatibility, `hookRequire`, custom synchronous retrieval, or exact
CallSite formatting.

## Behavioral review

Malformed maps now fall back instead of throwing from stack formatting,
generated file text is released after discovery, Error causes are retained,
and existing nonzero exit codes are respected. The browser artifact's syntax
floor is ES2015.
