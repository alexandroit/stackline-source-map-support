# Contributing

1. Use Node.js 20 or newer for development and install the locked toolchain
   with `npm ci`.
2. Preserve the CommonJS root, ESM host, historical registration entries, and
   standalone browser UMD global/named-AMD/CommonJS contract.
3. Add an upstream differential or focused characterization for every runtime
   behavior change. Browser changes also need process-free UMD and ESM cases.
4. Keep Node 14.15.1 runtime syntax, TypeScript 3.9 declarations, indexed
   source maps, VM formatting, malformed-map fallback, and packed consumers
   covered.
5. Run `npm run verify` before proposing a change. A release artifact may only
   be prepared from the exact clean commit approved by CI.
6. Do not add or update a dependency without a compatibility rationale, exact
   production-graph review, audit, bundled-code inventory, and license check.

Do not include credentials, private registries, proprietary consumer fixtures,
or unlicensed source. Report vulnerabilities through
[SECURITY.md](./SECURITY.md).
