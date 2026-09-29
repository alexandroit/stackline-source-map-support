# Publishing

`@stackline/source-map-support@1.0.0` is published and immutable. Use the
official npm bytes and the `stackline-v1.0.0` GitHub release at source commit
`110450f9bac02054a152cfd9fb463283e3ce8765`. Never rebuild, replace, or
republish version 1.0.0.

## Current maintenance release workflow

For new versions, use Node 24.20.0 and npm 11.19.0. Wait for the complete CI and CodeQL runs at the exact default-branch commit, download its `npm-package` artifact, review the package contents and SHA-512, then dispatch `publish.yml` with `ci_run_id` and `expected_sha512`. The workflow retains the full verification suite, downloads the reviewed CI archive, rejects an existing version, and publishes that exact archive with npm provenance. The existing repository token is available only to the publish step. Registry byte/signature/provenance checks and an immutable GitHub release complete the workflow.

The initial 1.0.0 record below is historical and remains unchanged.

## Frozen 1.0.0 release gate

The initial release must come from an immutable commit that is green in CI and
CodeQL. From a clean checkout of that exact commit, run:

```sh
npm --version # must be 10.8.2, matching CI
npm ci
npm run verify
STACKLINE_GREEN_COMMIT="$(git rev-parse HEAD)" npm run artifact:prepare
```

`artifact:prepare` refuses a dirty worktree, a mismatched or missing approved
commit, an npm version other than `10.8.2`, and an existing
`release-candidate/` directory. The immediately preceding `npm ci` must be a
fresh install from the committed lockfile. The tool rebuilds ignored browser
artifacts from those locked inputs before packing and rechecks source
cleanliness.

## Candidate review

Review the one-shot output before any publication:

- compare SHA-1, SHA-256, SHA-512, and npm integrity with the tarball;
- download the exact successful CI package artifact for the approved commit
  and require its tarball bytes to match the one-shot candidate;
- inspect the complete npm file inventory and `0644` modes;
- validate the CycloneDX installed graph, bundled-material relationships,
  source commit, commit timestamp, and VCS reference;
- install the exact tarball in the qualified downstream smoke lanes; and
- obtain the required human release approval.

This procedure produced the accepted 39,023-byte artifact with SHA-256
`d7ff4d6e01f067e595e3df603a2aa88486d783c7c11d45e4df073ed577f94adb`.
Verdaccio and official npm downloads matched it exactly, and clean direct and
historical-key alias consumers passed. Official npm created the version at
2026-08-29T02:12:43.455Z. The immutable GitHub release was published at
2026-08-29T02:17:33Z. Alexandro.Net catalog and package documentation were
deployed and verified before adoption contact. Future publication work starts
with a new version and must never mutate this release or its tag.
