# Third-party licenses

The installed production graph has one exact direct runtime dependency:

- `@stackline/trace-mapping@1.0.0` (installed as `@jridgewell/trace-mapping`, based on upstream0.3.31) — MIT; transitively uses
  `@jridgewell/resolve-uri` and `@jridgewell/sourcemap-codec`, both MIT.

The self-contained browser JavaScript and ESM artifacts bundle the same three
installed production packages plus `@stackline/path-browserify@1.0.0` (installed as `path-browserify`, based on upstream1.0.1) (MIT, Copyright
(c) 2013 James Halliday). `path-browserify` is bundled material only; it is a
development-time build input and is not installed in the production graph.
Exact upstream license bytes are copied to:

- `LICENSES/jridgewell-trace-mapping-MIT.txt`
- `LICENSES/jridgewell-resolve-uri-MIT.txt`
- `LICENSES/jridgewell-sourcemap-codec-MIT.txt`
- `LICENSES/path-browserify-MIT.txt`

The package runtime is derived from `source-map-support@0.5.21`, Copyright (c)
2014 Evan Wallace, under the MIT License reproduced in `LICENSE`.

`CallSiteToString` is copied almost verbatim from V8 4.3.49
`src/messages.js`, whose header is Copyright 2012 the V8 project authors. The
applicable BSD 3-Clause text from V8's `LICENSE.v8` is reproduced verbatim in
`LICENSES/V8-BSD-3-Clause.txt`.

Other build and test dependencies are development-only and are not installed
with the production package. The CycloneDX release SBOM distinguishes the
three-package installed graph from the four bundled browser materials.
