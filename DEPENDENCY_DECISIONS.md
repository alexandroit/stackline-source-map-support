# Dependency Decisions

Observation date: 2026-08-28.

## Installed production graph

| Dependency | Version | Decision |
| --- | --- | --- |
| `@jridgewell/trace-mapping` | `0.3.31` | Exact-pin the maintained Source Map v3 implementation. |
| `@jridgewell/resolve-uri` | `3.1.2` | Exact transitive URI-resolution dependency. |
| `@jridgewell/sourcemap-codec` | `1.6.0` | Exact transitive mapping codec dependency. |

The package has one direct production dependency. The complete installed
production closure is the three packages above (four nodes including the root)
with no optional or peer dependencies. `AnyMap` is used so regular and indexed
Source Map v3 payloads retain the historical sectioned-map contract.

## Browser bundled material

The self-contained browser JavaScript and ESM artifacts embed the same three
production packages plus `path-browserify@1.0.1`. `path-browserify` is an
exact-pinned development dependency and is not installed in the production
graph. Its resolver is wrapped at build time with a bundle-local absolute root
so browser-relative paths do not depend on or expose a Node.js `process`
global.

Exact upstream MIT license bytes for all four bundled materials are copied to
`LICENSES/`, inventoried in `THIRD_PARTY_LICENSES.md`, and represented in the
CycloneDX model. The SBOM properties distinguish the three installed packages
from all four bundled materials.

## Compatibility-only development inputs

`source-map-support@0.5.21` is installed under a development-only alias for
differential tests. TypeScript 3.9 and current TypeScript are both test-only
declaration gates. Build, lint, coverage, package-analysis, and audit tools are
development-only and locked in `package-lock.json`.
