import http from 'node:http'

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200)
    res.end('OK')
  } else {
    res.writeHead(404)
    res.end()
  }
})

export { httpServer }
