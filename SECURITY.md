# Security policy

Please report suspected vulnerabilities privately through GitHub's security
advisory interface for `alexandroit/stackline-source-map-support`. Do not put
exploit details in a public issue.

Supported security fixes target the current major release. Reports should
include the runtime, entry point, install options, minimal generated source and
map, and whether the input crosses a trust boundary.

## Trust model

This package installs process-global Error formatting and can wrap the
CommonJS compiler. Its default retrievers synchronously read local files or,
in a browser, perform synchronous XHR. Custom retrievers run application code
during stack creation. Treat maps, generated paths, and callbacks as privileged
developer inputs; isolate untrusted tenants and bound external input before it
reaches these hooks.

Malformed map payloads are isolated and cached as misses, and cache keys are
prototype-safe. These defenses do not turn source maps into a sandbox.
