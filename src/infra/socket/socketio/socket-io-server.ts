import { Server as HTTPServer } from 'node:http'
import { Server } from 'socket.io'
import { Controller } from '../controller'
import { AppEvent, SocketEmitter } from '../emitter'
import { SocketServer } from '../server'

export class SocketIOServer extends SocketServer implements SocketEmitter {
  private server: Server

  constructor(httpServer: HTTPServer) {
    super()
    this.server = new Server(httpServer, {
      cors: { origin: '*' },
      transports: ['websocket', 'polling'],
    })
  }

  setup(controllers: Controller[]): void {
    this.server.on('connection', (socket) => {
      console.log(
        new Date().toISOString(),
        '[Socket.IO] User connected',
        socket.id
      )

      socket.on('disconnect', (e) => {
        console.log(
          new Date().toISOString(),
          '[Socket.IO] User disconnected',
          socket.id,
          `| Reason: ${e}`
        )
      })

      socket.use(([event], next) => {
        console.log(
          new Date().toISOString(),
          `[Socket.IO] Event: ${event} | ${socket.id}`
        )
        next()
      })

      socket.on('join', (userId: string) => {
        socket.join(userId)
      })

      controllers.forEach((controller) =>
        socket.on(controller.path, async (payload) => {
          console.log(
            new Date().toISOString(),
            '[Socket.IO] Controller',
            controller.path,
            payload
          )
          await controller.handle(payload)
        })
      )
    })
  }

  toUser(userId: string, { name, payload }: AppEvent<unknown>): void {
    console.log(
      new Date().toISOString(),
      `[Socket.IO] Emitting event: ${name} : `,
      payload,
      `: to ${userId}`
    )
    this.server.to(userId).emit(name, payload)
  }
}
