import { httpServer } from '@/infra/http/server'
import { AddressInfo } from 'node:net'
import { io as Client, Socket } from 'socket.io-client'
import { SocketIOServer } from './socket-io-server'

describe('Join SocketIO Room (E2E)', () => {
  let clientSocket: Socket
  let socketServerURL: string
  let socketServer: SocketIOServer

  beforeEach(() => {
    socketServer = new SocketIOServer(httpServer)
    socketServer.setup([])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`
  })

  afterEach(() => {
    httpServer.close()
  })

  it('should be able to join a room', async () => {
    clientSocket = Client(socketServerURL)
    clientSocket.emit('join', '400400')
    await vi.waitFor(() => {
      if (!clientSocket.connected) {
        throw new Error('[TEST] Client not connected yet')
      }

      console.log('[TEST] Client connected')
    })

    const waitForResponse = new Promise<string>((resolve) => {
      clientSocket.on('join-test', resolve)
    })

    socketServer.toUser('400400', {
      name: 'join-test',
      payload: 'server-sent-to-room',
    })

    const payload = await waitForResponse

    expect(payload).toBeTruthy()
    expect(payload).toEqual('server-sent-to-room')
  })

  it('should not be able to receive message to other room', async () => {
    clientSocket = Client(socketServerURL)
    clientSocket.emit('join', '400400')
    await vi.waitFor(() => {
      if (!clientSocket.connected) {
        throw new Error('[TEST] Client not connected yet')
      }

      console.log('[TEST] Client connected')
    })

    const waitForResponse = new Promise<string>((resolve, reject) => {
      clientSocket.on('join-test', reject)
    })

    socketServer.toUser('500500', {
      name: 'join-test',
      payload: 'server-sent-to-other-room',
    })

    const payload = await waitForResponse

    expect(payload).toBeFalsy()
    // expect(payload).toEqual('server-sent-to-room')
  })
})
