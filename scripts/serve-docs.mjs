import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../site-dist/', import.meta.url))
const port = Number(process.env.PORT || 8080)
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/markdown', '.txt': 'text/plain', '.xml': 'application/xml' }

http.createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const filename = path.resolve(root, relative)
  if (!filename.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden')
    return
  }
  try {
    await stat(filename)
    response.setHeader('content-type', types[path.extname(filename)] || 'application/octet-stream')
    createReadStream(filename).pipe(response)
  } catch {
    response.writeHead(404).end('Not found')
  }
}).listen(port, () => console.log(`Documentation available at http://localhost:${port}`))
