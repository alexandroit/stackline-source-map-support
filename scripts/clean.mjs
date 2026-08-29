import { rm } from 'node:fs/promises'

for (const path of ['../coverage', '../site-dist', '../browser-source-map-support.js', '../browser-source-map-support.mjs']) {
  await rm(new URL(path, import.meta.url), { force: true, recursive: true })
}
