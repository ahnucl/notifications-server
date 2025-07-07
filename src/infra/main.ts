/**
 * For future reference:
 * Add tsyringe if this project grows
 */

import { httpServer } from './http/server'
import { makeControllers } from './socket/setup'
import { SocketIOServer } from './socket/socketio/socket-io-server'

const socketServer = new SocketIOServer(httpServer)
const controllers = makeControllers(socketServer)
socketServer.setup(controllers)

httpServer.listen(3333, () => {
  console.log('[HTTP] Server is running')
})
