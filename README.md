# @stackline/source-map-support

> Compatibility-first source-map stack traces for VM, browser, and custom loader integrations

[![npm version](https://img.shields.io/npm/v/@stackline/source-map-support.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/source-map-support)
[![license](https://img.shields.io/npm/l/@stackline/source-map-support.svg?style=flat-square)](https://github.com/alexandroit/stackline-source-map-support/blob/main/LICENSE)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-source-map-support)

**[Documentation](https://alexandro.net/docs/vanilla/source-map-support/)** |
**[npm](https://www.npmjs.com/package/@stackline/source-map-support)** |
**[Issues](https://github.com/alexandroit/stackline-source-map-support/issues)** |
**[Repository](https://github.com/alexandroit/stackline-source-map-support)**

**Package version:** `1.0.1`

## Why this package?

Maintained, compatibility-first source-map stack traces for the residual cases
that native Node.js source maps do not cover reliably: generated code executed
through `vm.runInThisContext()`, browser scripts, Electron integrations,
runtime transpilers, and custom source-map retrieval hooks.

For ordinary modern Node.js files, prefer native support (`--enable-source-maps`
or the current `node:module` API). This package exists for verified compatibility
contracts, not to replace the native path.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/source-map-support@1.0.1` |
| Node.js runtime | `>=14.15.1` |
| CommonJS / primary entry | `./source-map-support.js` |
| ES module entry | `./index.mjs` |
| Type declarations | `./source-map-support.d.ts` |

## Installation

<a id="install"></a>

### Install

```sh
npm install @stackline/source-map-support@1.0.1
```

Historical package-key migration can be source-free with an npm alias:

```json
{
  "dependencies": {
    "source-map-support": "npm:@stackline/source-map-support@1.0.1"
  }
}
```

## Usage

<a id="node-usage"></a>

### Node usage

The CommonJS root remains the upstream object API:

```js
const sourceMapSupport = require('@stackline/source-map-support')

sourceMapSupport.install({
  handleUncaughtExceptions: false
})
```

The historical side-effect entries remain available:

```js
require('@stackline/source-map-support/register')
require('@stackline/source-map-support/register-hook-require')
```

ES modules can use the compatible host entry:

```js
import sourceMapSupport, { install } from '@stackline/source-map-support'

install({ handleUncaughtExceptions: false })
```

<a id="browser-usage"></a>

### Browser usage

The historical standalone browser file and its global/AMD contracts are
preserved. This maintained package additionally routes
`./source-map-support.js` to `./browser-source-map-support.js` for bundlers via
its `browser` object and conditional root export. The browser artifact is a
self-contained UMD script with three tested loading modes:

- CommonJS returns the API object;
- named AMD defines `browser-source-map-support`;
- a normal script creates `globalThis.sourceMapSupport`.

The root `browser` + `import` condition uses a companion ESM browser host;
explicit `browser-source-map-support` imports retain the historical UMD entry.

The maintained browser bundle has an explicit ES2015 syntax floor. This is an
intentional difference from the much older syntax emitted in 0.5.21 and is
checked by an ES2015 parser and a runtime contract. It performs synchronous
XHR when the default browser retriever is used, matching the upstream API;
prefer a custom `retrieveFile` or `retrieveSourceMap` hook in new code.

## Features and Integrations

<a id="maintained-differences"></a>

### Maintained differences

- synchronous map lookup uses exact-pinned `@jridgewell/trace-mapping`;
- inspected generated file contents are released after map discovery;
- malformed maps fall back to generated positions and cache the miss;
- cache keys are prototype-safe;
- URL and top-level error-source resolution cover modern stack forms;
- uncaught output preserves `Error.cause` and an existing nonzero exit code;
- copied V8 code has its missing BSD-3-Clause attribution restored.

See `COMPATIBILITY_CONTRACT.md` and `MIGRATION.md` before changing global error
or loader hooks.

## Security

<a id="security-and-trust-boundary"></a>

### Security and trust boundary

Source maps, generated files, synchronous browser requests, and custom hooks
are privileged developer inputs. Do not install maps or hooks from an
untrusted tenant in a shared process. See `SECURITY.md` for disclosure and
hardening details.

## API Surface

<a id="api"></a>

### API

The root exports the same six functions as `source-map-support@0.5.21`:

- `install(options?)`
- `wrapCallSite(callSite, state?)`
- `getErrorSource(error)`
- `mapSourcePosition(position)`
- `retrieveSourceMap(source)`
- `resetRetrieveHandlers()`

`install()` preserves `environment`, `retrieveFile`, `retrieveSourceMap`,
`overrideRetrieveFile`, `overrideRetrieveSourceMap`, `hookRequire`,
`emptyCacheBetweenOperations`, and `handleUncaughtExceptions`.

First-party declarations cover CommonJS, the ESM host, deep side-effect
entries, the browser API, and TypeScript 3.9. Later TypeScript releases use
condition-specific `.d.cts` and `.d.mts` declarations.

## Local Development

```sh
git clone https://github.com/alexandroit/stackline-source-map-support.git
cd stackline-source-map-support
npm ci
npm run verify
```

Release tooling uses Node.js 24.20.0 and npm 11.19.0. The consumer runtime contract remains the one documented above.

## Consumer Smoke Test

Run the repository's existing consumer/package check after installing development dependencies:

```sh
npm run test:smoke
```

## Release Checklist

Run `npm run verify` and inspect the package contents before release. Publish a new version through the [GitHub Actions publishing workflow](https://github.com/alexandroit/stackline-source-map-support/actions/workflows/publish.yml), using the SHA-512 digest of the reviewed tarball. Verify the exact published version, tarball integrity, and npm provenance after the run.

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-source-map-support/issues). Use the [security policy](https://github.com/alexandroit/stackline-source-map-support/blob/main/SECURITY.md) for vulnerability reports.

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

<a id="provenance-and-license"></a>

### Provenance and license

The runtime continues `source-map-support@0.5.21` by Evan Wallace under MIT.
`CallSiteToString` is copied almost verbatim from V8 and retains the applicable
V8 BSD-3-Clause notice. Exact texts are in `LICENSE`, `NOTICE`, and `LICENSES/`.
The browser artifacts also ship exact MIT notices for their bundled
`@jridgewell/*` and `path-browserify` material.

This is an independent Stackline continuation. Stackline is not affiliated
with, endorsed by, or acting on behalf of Evan Wallace, the upstream npm
maintainers, Google, or the V8 project.
