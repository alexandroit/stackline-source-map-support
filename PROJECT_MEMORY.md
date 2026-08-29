---
schema: stackline-project-memory-v1
package: source-map-support
target: "@stackline/source-map-support"
version: 1.0.0
state: PUBLISHED
updated: 2026-08-29
---

# Project Memory

## Frozen decision

The dated GO decision is frozen in [UPSTREAM_AUDIT.md](./UPSTREAM_AUDIT.md).
Queue rank 1 was an unpinned `WATCH` promoted by fresh evidence. Ordinary
modern Node execution should prefer native source maps; the replacement exists
for the verified `vm.runInThisContext()`, browser, Electron and synchronous
custom-hook compatibility boundary.

## Compatibility boundary

Preserve CommonJS root and deep register entries, browser global and AMD
bundles, inline/external/indexed maps, custom `retrieveFile` and
`retrieveSourceMap`, hook options, generated and VM frames, source paths,
`Error.prepareStackTrace`, and V8 CallSite formatting. ESM-host entries and
TypeScript declarations are additive. Node.js `>=14.15.1` is the supported
floor.

## Published state

Source commit `110450f9bac02054a152cfd9fb463283e3ce8765` passed main CI
`33228189936` and CodeQL `33228189913`. The same commit passed tag CI
`33228502035` and tag CodeQL `33228501965`. The local gate covers 33 upstream
tests, eight characterization/error tests, VM and indexed-section
differentials, five malformed/security cases, stress/memory, process-free UMD
and browser ESM, TypeScript 3.9/current, exact Node 14.15.1 through 26.8.1,
and packed scoped/deep/historical-key consumers. Coverage is 87.33% lines and
statements, 82.22% branches and 96.77% functions. Publint and Are the Types
Wrong pass; production/full audits contain zero known findings.

The accepted immutable artifact contains 28 mode-`0644` files, is 39,023 bytes
packed and 110,367 bytes unpacked, and has SHA-1
`801cb253ae7170f3671b029d7ad5e18bc02cf58f`, SHA-256
`d7ff4d6e01f067e595e3df603a2aa88486d783c7c11d45e4df073ed577f94adb`,
and npm integrity
`sha512-g+1XoNwCvqhaBaULXdvQONtpgguob0NS6k3ngArnuGPhVDrpEjk6WnRb+9ypiYIgCtD8KW+cE1SRHGHiseKfSA==`.
Its CycloneDX record preserves three installed production components and four
browser-bundled MIT materials, including `path-browserify@1.0.1`.

Verdaccio accepted and returned the exact bytes before official npm. Clean
scoped and historical-key alias consumers passed against both registries.
Official npm created `@stackline/source-map-support@1.0.0` at
2026-08-29T02:12:43.455Z. A transient full-packument E404 followed the
successful write while the version endpoint, dist-tag and tarball already
existed; nothing was republished. Full metadata propagated and the fetched
official tarball matched the accepted artifact.

The annotated `stackline-v1.0.0` tag points to the already-green source commit.
The GitHub release was published at 2026-08-29T02:17:33Z with eight exact
assets and reports `immutable: true`. Its downloaded tarball and GitHub asset
digest match the accepted SHA-256. Do not move, delete, recreate or repoint the
tag or release.

## Adoption coverage

The focused Tabby pull request
<https://github.com/Eugeny/tabby/pull/11630> preserves the historical package
key through the exact npm alias. Its base is
`14e2d60b9b6dee84a53c37f05eefeb803787de04` and its head is
`3ddadc04a8301ba835404926f055256ca124018f`; only `app/package.json` and
`app/yarn.lock` change. Clean Node 22/Yarn 1 frozen installs, alias identity,
typings, literal lint, full build, Electron 38 mapped-error smoke and
`git diff --check` passed. The PR discloses independent Stackline
maintainership, the Node floor, lockfile normalization and AI involvement; it
makes no vulnerability claim. Remote CodeQL, lint and one macOS build passed;
six cross-platform package-build jobs were still in progress with no failure at
the 2026-08-29T02:42:16Z observation.

The different-repository issue
<https://github.com/desktop/desktop/issues/22782> records Desktop commit
`b17e06dd0f0d9a45807eb39a51d223f52eb14da9`, the exact manifest/lockfile
versions, custom retrieval wrapper, selective mapping, crash-process exclusion
and startup-performance contract. It asks maintainers to choose intentional
retention, native/another tested implementation, or an exact Stackline alias.
It discloses maintainership and the Node-floor policy difference and makes no
security claim.

Desktop's triage bot added one automated comment, found no duplicate, and
classified the issue as an actionable maintainer decision at low confidence.
The executor did not reply.

The repositories differ and release-local adoption coverage is complete. Do
not follow up unsolicited; respond only to a concrete maintainer question with
evidence.

## Documentation record

Production documentation is at
<https://alexandro.net/docs/vanilla/source-map-support/>. Private catalog
source commit `713db4ec78e269dca8316c76670c2519a1c131c2` passed CI
`33228821792`; deployment-memory commit
`734a733ac5b28eeb32822fa6cd656946ae2f340c` passed CI `33229293272`.
Private code scanning was unavailable and returned 403, so repository privacy
was preserved and the required private CI plus full local catalog gate were
used.

The root and compatibility catalogs match their 34-file local builds, and the
standalone package matches its 26-file build. The docs aggregate sitemap moved
from 3,289 to 3,304 unique canonical URLs with exactly 15 package routes and no
compatibility-mirror URLs. Origin, ordinary public DNS and Cloudflare IPv4/IPv6
returned HTTP 200 with expected MIME types. Responsive 1,440/390-pixel checks
found no overflow; the two-column desktop introduction collapses to one column
on mobile. Forty concurrent IPv4/IPv6 edge requests all returned 200 while
listen drops stayed 692 and overflows stayed zero. Rollback bytes are at
`/var/backups/stackline-docs/20260829T022531Z-source-map-support`.

## Canonical record

Canonical Drive project memory: `1jNa1mDDPnbU1k5UpWidQTFJNRxWv23Eg`,
<https://drive.google.com/file/d/1jNa1mDDPnbU1k5UpWidQTFJNRxWv23Eg/view>.
