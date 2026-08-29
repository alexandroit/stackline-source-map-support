# Registry Handoff

- upstream: `source-map-support@0.5.21`
- target: `@stackline/source-map-support@1.0.0`
- decision: GO, frozen 2026-08-29
- state: `PUBLISHED`
- queue selection: rank 1 `WATCH`, freshly promoted; no user pin
- runtime: Node.js `>=14.15.1`
- source/tag commit: `110450f9bac02054a152cfd9fb463283e3ce8765`
- main CI / CodeQL: `33228189936` / `33228189913`
- tag CI / CodeQL: `33228502035` / `33228501965`
- artifact: 39,023 bytes, 28 files, 110,367 bytes unpacked, mode `0644`
- artifact SHA-1: `801cb253ae7170f3671b029d7ad5e18bc02cf58f`
- artifact SHA-256: `d7ff4d6e01f067e595e3df603a2aa88486d783c7c11d45e4df073ed577f94adb`
- artifact integrity: `sha512-g+1XoNwCvqhaBaULXdvQONtpgguob0NS6k3ngArnuGPhVDrpEjk6WnRb+9ypiYIgCtD8KW+cE1SRHGHiseKfSA==`
- Verdaccio: exact bytes plus clean scoped/historical-key consumers PASS
- official npm: created `2026-08-29T02:12:43.455Z`; full metadata propagated
  after one transient packument E404 and no republish
- official npm consumers: exact tarball plus clean scoped, CommonJS, ESM, deep
  and historical-key alias consumers PASS
- npm: <https://www.npmjs.com/package/@stackline/source-map-support>
- repository: <https://github.com/alexandroit/stackline-source-map-support>
- immutable release:
  <https://github.com/alexandroit/stackline-source-map-support/releases/tag/stackline-v1.0.0>
- release: `immutable: true`, eight exact assets, published
  `2026-08-29T02:17:33Z`
- documentation: <https://alexandro.net/docs/vanilla/source-map-support/>
- catalog source commit:
  `713db4ec78e269dca8316c76670c2519a1c131c2`, CI `33228821792`
- deployment-memory commit:
  `734a733ac5b28eeb32822fa6cd656946ae2f340c`, CI `33229293272`
- production: 34/34 root files, 34/34 compatibility files, 26/26 package
  files, 15/15 canonical routes, origin/public/Cloudflare IPv4+IPv6 PASS
- availability: 40/40 concurrent edge requests PASS; listen drops remained
  692 and overflows remained zero

Use the published npm bytes and immutable release. Never rebuild, replace,
republish, move or recreate version 1.0.0 or its tag.

## Adoption handoff

- Pull request: <https://github.com/Eugeny/tabby/pull/11630>, base
  `14e2d60b9b6dee84a53c37f05eefeb803787de04`, head
  `3ddadc04a8301ba835404926f055256ca124018f`; only `app/package.json` and
  `app/yarn.lock` changed.
- Pull-request validation: clean Node 22/Yarn 1 frozen installs, exact alias
  identity, typings, literal lint, full build, Electron 38 mapped-error smoke
  and `git diff --check` PASS.
- Pull-request remote state: CodeQL, lint and one macOS job PASS; six platform
  builds in run `33229205500` remained in progress with no failure at the
  2026-08-29T02:42:16Z read.
- Different-repository issue:
  <https://github.com/desktop/desktop/issues/22782>, evidence base
  `b17e06dd0f0d9a45807eb39a51d223f52eb14da9`; exact declaration, lockfile,
  wrapper, selective-map and performance paths recorded; no target mutation.
- Both contacts contain independent-maintainer disclosure, neutral wording and
  no vulnerability claim.
- Desktop's triage bot found no duplicate and added one automated comment; no
  reply was sent.
- Different-repository check: `PASS`; adoption coverage: `COMPLETE`.
- Do not send an unsolicited follow-up. Respond only to a concrete maintainer
  question with evidence.

## Canonical Drive records

- GO decision: `1GD9LihLB6QLGuY5H-bIDT3g6HiNCfaRG`
- structured GO decision: `152WtPimd_C5_I5PzwO5jK-RakZV_K1A4`
- project memory: `1jNa1mDDPnbU1k5UpWidQTFJNRxWv23Eg`
- release verification: `15mqqaxpIjQj5cLtATVzzDJ545TdAY-vm`
- adoption targets: `1ZACd_8ulKOiH5qw6ycJfpFLhp1Qc2Eui`
- registry handoff: `1kY54d_u4SlUROHTbSKbIeJ6n-Wa4sGeF`
- Tabby PR event: `1hJnFFbf_L_Dudd75qQtdJTY7t82vsdQJ`
- Desktop issue event: `1p7HQ8FaXlWFN6DlOYXEKKEgIl1FVoSM7`
