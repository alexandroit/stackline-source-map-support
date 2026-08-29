# `source-map-support` — dated GO decision

Observed: 2026-08-29T01:14:30Z
Selected queue rank: 1
Starting state: `WATCH`
Decision: **GO / promote to `BUILDING`**
Stackline target: `@stackline/source-map-support@1.0.0`

## Decision

Fresh primary-source evidence promotes this package through the decision gates.
Ordinary modern Node.js execution should use native source-map support, but
native support still does not cover the package's complete compatibility
surface. A Node.js 26.8.1 differential test mapped a normal file with native
source maps but left `vm.runInThisContext()` at the generated location even
after `module.setSourceMapsSupport(true, { generatedCode: true })`; the released
package mapped the same frame to the original source. Active Electron projects
also directly use its `register`, custom `retrieveSourceMap`,
`handleUncaughtExceptions`, and `Error.prepareStackTrace` contracts.

The upstream repository is non-archived but its Node implementation has not
changed since the 0.5.21 release and its last default-branch commit was
documentation-only in 2022. Current unresolved evidence includes memory
retention issue 344, attribution issue 343, `Error.cause` issue 337, process
exit-code PR 338, and CallSite-formatting PR 342. Three npm writers remain, so
this is not described as owner abandonment. The problem is the unmaintained
release and unresolved residual compatibility surface.

## Current package evidence

- Official npm latest: `source-map-support@0.5.21`, published
  2021-11-19, MIT, not deprecated.
- Complete-week downloads: 118,109,775 for 2026-08-22 through 2026-08-28,
  observed 2026-08-29 from the official npm downloads API. This is reach
  evidence, not proof of direct use.
- npm writers: `linusu`, `evanw`, `julien-f`.
- Canonical source: `evanw/node-source-map-support`, non-archived; last default
  branch commit `7b5b81eb14c9ee6c6537398262bf7dab8580621c` at
  2022-11-01T10:23:29Z.
- Immutable upstream tarball SHA-1:
  `04fe7c7f9e1ed2d662233c28cb2b35b9f63f6e4f`; SHA-256:
  `5d9b04ef3e6824fdcf91cfcc03ab427fae486bc6859735805593f51b3554f636`.
- Tarball inventory: seven files, 85,177 unpacked bytes; runtime dependencies
  `buffer-from@^1.0.0` and `source-map@^0.6.0`.
- Upstream master test suite: 33/33 pass on Node.js 20.20.2. Latest-version OSV
  and GitHub advisory checks returned no findings; `npm audit --omit=dev`
  passed. The stale development tree reported 45 findings and is not suitable
  for a maintained release workflow.

## Decision gates

- Legal/provenance: **conditional pass**. Preserve Evan Wallace's MIT license.
  `CallSiteToString` was copied from V8; restore the applicable V8 copyright
  and BSD-3-Clause notice. Missing either notice blocks publication.
- Real current problem: **pass**. Current VM/Electron/browser/custom-hook needs
  remain, and current correctness and retention reports have no release.
- Forward-looking necessity: **pass, narrow scope**. Native Node is the
  recommended ordinary path; the replacement exists for the verified residual
  contracts and must document that boundary.
- Differentiation: **pass**. `@cspotcode/source-map-support@0.8.1` and its source
  are also from 2022. Stackline will supply current CI, restored provenance,
  tested fixes, first-party types, clean release metadata, and maintained
  compatibility surfaces.
- Compatibility feasibility: **pass**. Upstream tests plus differential,
  browser, AMD, CommonJS, ESM-host, VM, hook, malformed-map, error-formatting,
  memory, stress, packed-consumer, and TypeScript tests can define the contract.
- Maintenance burden: **medium-high but bounded**. Global error and loader hooks
  require security and lifecycle testing; the package is small and its public
  API is finite.
- Adoption path: **pass** with two different qualified direct users below.
- Evidence path: **pass** through native-versus-package differential results,
  reproduced issue regressions, exact packed consumers, CI/CodeQL, and external
  downstream gates.

## Compatibility contract

Preserve the callable CommonJS root and its `install`, retrieval-hook and
source-map APIs; deep entries `register`, `register-hook-require`, and
`browser-source-map-support`; Node and browser selection; browser global and
AMD behavior; inline/external maps, `sourcesContent`, `sourceRoot`, URLs and
Windows paths; `vm.runInThisContext`; `hookRequire`,
`handleUncaughtExceptions`, custom `retrieveFile`/`retrieveSourceMap`, and
environment options. Add ESM-host and TypeScript entry contracts without
breaking historical CommonJS consumers.

## Qualified release-local adoption plan

1. Tested migration PR: `Eugeny/tabby`. Its active Electron app directly
   declares `source-map-support` and imports `source-map-support/register` in
   the main entry. Use the historical-key npm alias with unchanged source.
   Required gates are the repository's lint, app build, and an exact packaged
   Electron/main-process mapped-error smoke.
2. Different-repository decision issue: `desktop/desktop`. It directly pins the
   older 0.4 line and calls custom `retrieveSourceMap`,
   `handleUncaughtExceptions: false`, and preserved `Error.prepareStackTrace`
   integrations in Electron main and renderer processes. Its contribution
   policy requests discussion first. Ask maintainers to choose native support,
   a maintained exact alias, or intentional retention; make no public security
   claim.

Live local-ledger and GitHub searches found no Stackline/alexandroit contact,
maintainer decline, or competing migration in either repository. Revalidate
immediately before any public write.

## Primary sources

- https://registry.npmjs.org/source-map-support/0.5.21
- https://api.npmjs.org/downloads/point/2026-08-22:2026-08-28/source-map-support
- https://github.com/evanw/node-source-map-support
- https://github.com/evanw/node-source-map-support/issues/344
- https://github.com/evanw/node-source-map-support/issues/343
- https://github.com/evanw/node-source-map-support/issues/337
- https://github.com/evanw/node-source-map-support/pull/338
- https://github.com/evanw/node-source-map-support/pull/342
- https://nodejs.org/api/cli.html#--enable-source-maps
- https://nodejs.org/api/module.html#source-map-support
- https://chromium.googlesource.com/v8/v8/+/4.3.49/LICENSE.v8
- https://github.com/Eugeny/tabby/blob/14e2d60b9b6dee84a53c37f05eefeb803787de04/app/lib/index.ts
- https://github.com/desktop/desktop/blob/b17e06dd0f0d9a45807eb39a51d223f52eb14da9/app/src/lib/source-map-support.ts

No implementation existed when this GO record was written. Publication remains
blocked until every local, remote, artifact, registry, documentation, legal and
release-local adoption prerequisite in the continuous program passes.
