# Verification

Observed 2026-08-29 in the local package workspace and against the public
registries, GitHub and Alexandro.Net.

## Required package gates

- Exact upstream 0.5.21 behavior plus VM, indexed-map and malformed-input
  differentials.
- CommonJS, ESM host, browser global/AMD, deep register entries and custom
  retrieval hooks.
- TypeScript 3.9/current and exact Node.js 14.15.1 through 26.8.1.
- Stress, memory, global-hook restoration, process-free browser and packed
  scoped/historical-key consumers.
- Publint, Are the Types Wrong, coverage, license/attribution, SBOM, audits,
  registry signatures and deterministic build checks.

## Local and remote release gate

The complete gate passed independently in the implementation workspace, an
isolated clean-copy audit and a final root-owned verification. It recorded 33
upstream tests, eight characterization/error cases, five malformed/security
cases and the VM/indexed-map differentials. Coverage was 87.33% lines and
statements, 82.22% branches and 96.77% functions. Publint reported no problem
and one intentional browser-object suggestion; Are the Types Wrong was all
green. Production and full audits found zero known vulnerabilities. All 177
installed registry packages had verified signatures and 25 had attestations.

Public source commit `110450f9bac02054a152cfd9fb463283e3ce8765`
passed main CI `33228189936` and CodeQL `33228189913`. Its annotated release
tag passed CI `33228502035` and CodeQL `33228501965`; every required job
completed successfully.

## Rejected precommit artifact

The precommit attempt preserved under
`automation/state/artifact-attempts/source-map-support/20260829T014350Z-precommit-nonreproducible/`
was rejected before any public write because its second browser ESM build
embedded an outer UMD wrapper. It was 37,645 bytes with SHA-256
`0f2b4ee21f05e57fce1d97f80affbff94c600fa9e472b7e9265d6494b73e202f`.
No rejected bytes were pushed, published, tagged, released or deployed.

## Accepted artifact and registries

The accepted npm 10.8.2 artifact is byte-identical to the exact green GitHub CI
artifact:

- file: `stackline-source-map-support-1.0.0.tgz`
- packed/unpacked: 39,023 / 110,367 bytes
- regular files: 28, all mode `0644`
- SHA-1: `801cb253ae7170f3671b029d7ad5e18bc02cf58f`
- SHA-256: `d7ff4d6e01f067e595e3df603a2aa88486d783c7c11d45e4df073ed577f94adb`
- SHA-512: `83ed57a0dc02bea85a05a50b5ddbd038db69820ba86f4352ea4de7800ae7b863e1543ae912393a5a745bfbdca98982200ad0fc296f9c1354911c61e2b1e29f48`
- integrity: `sha512-g+1XoNwCvqhaBaULXdvQONtpgguob0NS6k3ngArnuGPhVDrpEjk6WnRb+9ypiYIgCtD8KW+cE1SRHGHiseKfSA==`

Verdaccio accepted those exact bytes first. A first CLI invocation omitted the
required `./` path prefix and npm interpreted the tarball name as a GitHub
specifier; it failed before any registry write. A fresh E404 preflight then
preceded the corrected single publish. Exact-byte download plus clean scoped
and alias consumers passed.

Official npm created the version at 2026-08-29T02:12:43.455Z. The full
packument returned a transient CDN E404 after the successful PUT while access,
`latest`, the version endpoint and tarball were already public. No second
publish was attempted. The full packument propagated with the expected 28
files, 110,367 unpacked bytes, SHA-1 and integrity. The official tarball matched
the accepted SHA-256, and fresh unauthenticated scoped, CommonJS, ESM, deep and
historical-key alias consumers passed.

## Immutable GitHub release

The repository immutability setting was enabled before the first release. The
initial API attempt incorrectly supplied an unsupported JSON field and returned
422 without creating a release; the documented no-body request enabled the
setting. The final annotated `stackline-v1.0.0` tag points to the green commit.
The release at
<https://github.com/alexandroit/stackline-source-map-support/releases/tag/stackline-v1.0.0>
was published at 2026-08-29T02:17:33Z, reports `immutable: true`, and exposes
eight exact assets. The release tarball asset reports SHA-256
`d7ff4d6e01f067e595e3df603a2aa88486d783c7c11d45e4df073ed577f94adb`
and matched an independent download.

## Production documentation

Private catalog commit `713db4ec78e269dca8316c76670c2519a1c131c2`
passed CI `33228821792`; deployment-memory commit
`734a733ac5b28eeb32822fa6cd656946ae2f340c` passed CI `33229293272`.
Private code scanning was unavailable; GitHub returned 403 and repository
privacy was not weakened. Local `npm test` validated 43 packages, four guides,
the root build and compatibility build.

Production matched the 34-file root, 34-file mirror and 26-file package
manifests. The aggregate docs sitemap SHA-256 is
`ad0cc9d87a567a70c32eefd70a6363322818dd6b6ee11aeeafd39df1a8ff6c5c`
and contains 3,304 unique URLs, including 15 package routes and no mirror URL.
Origin, ordinary DNS and Cloudflare IPv4/IPv6 returned HTTP 200 with expected
MIME types for catalog, search data, robots, sitemaps, package metadata and the
browser example. HTTP redirects preserve path/query, unknown origin hosts still
close with 444, HTTP/3 remains disabled, and responsive production checks at
1,440 and 390 pixels found no overflow.

Nginx stayed active with zero restarts and the documented file-descriptor,
connection, multi-accept and keepalive settings. Twenty IPv4 plus twenty IPv6
concurrent edge requests all returned 200; `TcpExtListenDrops` remained 692 and
`TcpExtListenOverflows` remained zero.

## Adoption verification

- Pull request: <https://github.com/Eugeny/tabby/pull/11630>, base
  `14e2d60b9b6dee84a53c37f05eefeb803787de04`, head
  `3ddadc04a8301ba835404926f055256ca124018f`, two changed files.
- Changed-tree verification: clean Node 22/Yarn 1 frozen installs, installed
  alias identity, typings, literal lint, full build, Electron 38 mapped-error
  smoke and `git diff --check` passed.
- Tabby CodeQL run `33229205502`, the Package-Build lint job and one macOS job
  passed. Six macOS, Windows and Linux build jobs in run `33229205500` were in
  progress with no failures at the 2026-08-29T02:42:16Z observation.
- Issue: <https://github.com/desktop/desktop/issues/22782>, evidence base
  `b17e06dd0f0d9a45807eb39a51d223f52eb14da9`, no repository mutation.
- Desktop's triage bot found no duplicate and added one automated comment; the
  executor did not reply.
- Both contacts disclose independent Stackline maintainership and make no
  vulnerability claim. The issue offers neutral retention and alternative
  implementation choices.
- Different-repository check: **PASS**. Adoption coverage: **COMPLETE**. No
  unsolicited follow-up is authorized.

## Canonical record

Canonical Drive release verification: `15mqqaxpIjQj5cLtATVzzDJ545TdAY-vm`,
<https://drive.google.com/file/d/15mqqaxpIjQj5cLtATVzzDJ545TdAY-vm/view>.
