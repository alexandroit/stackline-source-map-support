# Issue Triage

## Native Node.js boundary

Modern Node.js source-map support should be the first choice for ordinary
files. Reports for this package should identify the compatibility need, such as
`vm.runInThisContext`, a custom retrieval hook, historical registration, or a
browser host, and include the exact Node.js version and launch flags.

## Compatibility reports

Include a minimal generated file, its complete Source Map v3 payload, the
expected original position, and the actual stack. For indexed maps, preserve
all section offsets, names, `sourceRoot`, and `sourcesContent`. For CallSite
formatting, include the equivalent native V8 output so aliases are not changed
from current engine behavior.

Browser reports must identify the loading mode (root conditional ESM,
standalone UMD global, named AMD, or CommonJS), browser/bundler version, and
whether paths are absolute URLs or relative names. The maintained browser
artifacts intentionally have an ES2015 syntax floor.

## Malformed input and security

Malformed maps and inline base64 must fall back to the generated position
without replacing the application error. Potential vulnerabilities follow
`SECURITY.md`; do not open a public issue before maintainers have had a
reasonable opportunity to assess the report.
