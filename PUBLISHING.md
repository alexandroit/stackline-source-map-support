# Publishing

`@stackline/source-map-support@1.0.0` is not yet published. The public source
repository and its untagged release-candidate commit are required for the
remote gate. Do not create a tag, registry release, deployment, or downstream
contact until the ordered gates below pass.

## Release gate

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

Publish the already-reviewed tarball bytes once. Record official registry and
repository URLs, tag/commit, timestamps, and downloaded-registry hash matches
only after those events actually occur. Publish to the established Verdaccio
registry first and verify a downloaded direct install and historical-key npm
alias. Then publish the same tarball exactly once to official npm and repeat
the byte and consumer checks. Never republish `1.0.0`; if propagation or a
post-publication surface fails, resume from the immutable registry bytes.
