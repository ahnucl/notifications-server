import http from 'node:http'
import { Server } from 'socket.io'

// interface App {
//   httpServer: http.Server
//   socketServer: Server
// }

type Controller = object

class AppServer {
  constructor(
    private server: http.Server,
    private controllers: Controller[]
  ) {}
}

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200)
    res.end('OK')
  } else {
    res.writeHead(404)
    res.end()
  }
})

const socketServer = new Server(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})

socketServer.on('connection', (socket) => {
  console.log('User connected', socket.id)
  socket.use(([event], next) => {
    console.log(`[Socket.IO] Event: ${event}`)
    next()
  })
})

socketServer.engine.on('connection_error', (err) => {
  console.log(err.req) // the request object
  console.log(err.code) // the error code, for example 1
  console.log(err.message) // the error message, for example "Session ID unknown"
  console.log(err.context) // some additional error context
})

httpServer.listen(3333, () => {
  console.log('[HTTP] Server is running')
})

setInterval(() => {
  socketServer.emit('server_time', { time: Date.now() })
}, 10000)
