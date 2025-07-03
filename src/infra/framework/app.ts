import { Server } from 'socket.io'
import {
  AppEvent,
  SocketEmitter,
} from '../socket/controllers/create-monitoring-item-comment-notification.controller'
import { setupControllers } from '../socket/controllers/setup'
import { httpServer } from '../http/server'

// Server setup

const socketServer = new Server(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})

class SocketIOServer implements SocketEmitter {
  private server = socketServer

  toUser(userId: string, { name, payload }: AppEvent<unknown>): void {
    console.log(
      `[Socket.IO] Emitting event: ${name} : ${payload} : to ${userId}`
    )
    this.server.to(userId).emit(name, payload)
  }
}

const emitter = new SocketIOServer()
//

// Controllers
const controllers = setupControllers(emitter)
//

// Socket setup
socketServer.on('connection', (socket) => {
  console.log('[Socket.IO] User connected', socket.id)

  socket.on('disconnect', (e) => {
    console.log('[Socket.IO] User disconnected', socket.id, `| Reason: ${e}`)
  })

  socket.use(([event], next) => {
    console.log(`[Socket.IO] Event: ${event} : ${socket.id}`)
    next()
  })

  // socket.on('chat_message', (msg: string) => {
  //   console.log('data', msg)
  //   socket.emit('msg_received', `Mensagem recebida! ${socket.id}`)
  // })

  socket.on('join', (userId: string) => {
    socket.join(userId)
  })

  // socket.on('join_test', (userId: string) => {
  //   socketServer
  //     .to(userId)
  //     .emit('join_test_response', `Received from ${userId}`)
  // })

  controllers.forEach((c) =>
    socket.on(c.path, async (payload) => {
      console.log('[Socket.IO]', c.path, payload)
      await c.handle(JSON.parse(payload))
    })
  )
})

httpServer.listen(3333, () => {
  console.log('[HTTP] Server is running')
})
