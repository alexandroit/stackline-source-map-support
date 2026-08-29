# Adoption Targets

Observation date: 2026-08-29.

This is a dated compatibility and contact record, not evidence of maintainer
approval. `@stackline/source-map-support@1.0.0` is publicly verified.

## Pull request lane — OPEN

The focused migration pull request is
<https://github.com/Eugeny/tabby/pull/11630>. It targets `Eugeny/tabby` base
commit `14e2d60b9b6dee84a53c37f05eefeb803787de04` from head commit
`3ddadc04a8301ba835404926f055256ca124018f`. The changed tree contains only
`app/package.json` and `app/yarn.lock`; the exact historical-key alias is
`source-map-support: npm:@stackline/source-map-support@1.0.0`.

The existing `source-map-support/register` import in `app/lib/index.ts` and
CommonJS external in `app/webpack.config.main.mjs` remain unchanged. Clean Node
22.23.0/Yarn 1.22.22 app and root frozen installs, exact installed identity,
`build:typings`, literal lint, full build, Electron 38.8.6
`ELECTRON_RUN_AS_NODE=1` mapped-error smoke and `git diff --check` passed.
Generated Yarn output also normalized existing `string-width`, `strip-ansi`
and `wrap-ansi` selector groups; that limitation is disclosed in the PR.

The PR is open, non-draft and mergeable. CodeQL, remote lint and one macOS job
passed; six macOS, Windows and Linux package-build jobs were still in progress
with no failure at the 2026-08-29T02:42:16Z observation. The PR discloses independent Stackline
maintainership, lack of affiliation/endorsement, the Node floor, the absence of
a security claim and exactly the `AI-designed, AI-coded, manually checked`
repository category. Do not add a promotional comment or unsolicited follow-up.

## Maintainer-decision issue — OPEN

The different-repository issue is
<https://github.com/desktop/desktop/issues/22782>, based on `desktop/desktop`
commit `b17e06dd0f0d9a45807eb39a51d223f52eb14da9`. It identifies the exact
`source-map-support@^0.4.15` manifest declaration, 0.4.18 lockfile resolution,
custom synchronous `retrieveSourceMap`, selective `renderer.js`/`main.js`
mapping, crash-process exclusion, retained `Error.prepareStackTrace`, explicit
mapping wrapper and #1900 startup-performance boundary.

The issue asks maintainers to choose intentional retention, Electron/Node
native or another contract-tested implementation, or an exact historical-key
Stackline alias. It records that the replacement fits the active Node
24.15.0/Electron 42 toolchain but would raise the repository's declared Node
`>=10` install floor to `>=14.15.1`. It offers to prepare a narrow manifest and
lockfile patch only after maintainer direction.

The issue is open and unlocked. Desktop's triage bot added one automated
comment, found no duplicate, and described the request as an actionable
maintainer decision at low confidence. The executor did not reply. The issue
discloses independent maintainership, lack of affiliation/endorsement and
neutral alternatives, and makes no vulnerability or security-fix claim.

## Coverage

The pull request and issue target different repositories: **PASS**. Required
release-local adoption coverage is **COMPLETE**. Live GitHub deduplication was
performed immediately before both writes and found no prior Stackline contact,
competing migration or maintainer decline. Monitor without unsolicited
follow-up; respond only to a concrete maintainer question with evidence.

## Canonical record

Canonical Drive adoption record: `1ZACd_8ulKOiH5qw6ycJfpFLhp1Qc2Eui`,
<https://drive.google.com/file/d/1ZACd_8ulKOiH5qw6ycJfpFLhp1Qc2Eui/view>.
