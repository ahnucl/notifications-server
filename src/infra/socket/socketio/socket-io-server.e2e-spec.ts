import { httpServer } from '@/infra/http/server'
import { AddressInfo } from 'node:net'
import { io as Client } from 'socket.io-client'
import { SocketIOServer } from './socket-io-server'

describe('Join SocketIO Room (E2E)', () => {
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
    const clientSocket = Client(socketServerURL)
    clientSocket.emit('join', '400400')
    await vi.waitFor(() => {
      expect(clientSocket.connected).toBeTruthy()
    })

    const waitForResponse = new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('[TEST] Test timeout: No join-test event received'))
      }, 100)

      clientSocket.once('join-test', (payload) => {
        clearTimeout(timeout)
        resolve(payload)
      })
    })

    socketServer.toUser('400400', {
      name: 'join-test',
      payload: 'server-sent-to-room',
    })

    const payload = await waitForResponse

    expect(payload).toBeTruthy()
    expect(payload).toEqual('server-sent-to-room')

    clientSocket.off()
    clientSocket.disconnect()
  })

  it('should not receive messages sent to other rooms', async () => {
    const clientSocket1 = Client(socketServerURL)
    clientSocket1.emit('join', '400400')
    const clientSocket2 = Client(socketServerURL)
    clientSocket2.emit('join', '500500')

    await Promise.all([
      vi.waitFor(() => {
        expect(clientSocket1.connected).toBeTruthy()
      }),
      vi.waitFor(() => {
        expect(clientSocket2.connected).toBeTruthy()
      }),
    ])

    const forbiddenEventHandler = vi.fn()
    clientSocket1.once('join-test', forbiddenEventHandler)

    const allowedEventHandler = vi.fn()
    clientSocket2.once('join-test', allowedEventHandler)

    socketServer.toUser('500500', {
      name: 'join-test',
      payload: 'server-sent-to-other-room',
    })

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(forbiddenEventHandler).not.toHaveBeenCalled()
    expect(allowedEventHandler).toHaveBeenCalled()

    clientSocket1.off()
    clientSocket1.disconnect()
    clientSocket2.off()
    clientSocket2.disconnect()
  })
})
