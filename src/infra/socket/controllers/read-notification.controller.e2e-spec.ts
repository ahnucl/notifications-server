import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { RedisNotificationMapper } from '@/infra/database/redis/mappers/redis-notification-mapper'
import {
  createIndex,
  client as redisClient,
} from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { httpServer } from '@/infra/http/server'
import { AddressInfo } from 'node:net'
import { io as Client } from 'socket.io-client'
import { makeNotification } from 'test/factories/make-notification'
import { SocketIOServer } from '../socketio/socket-io-server'
import { ReadNotificationController } from './read-notification.controller'

describe('Create a Monitoring Item Comment notification (E2E)', () => {
  let readNotificationController: ReadNotificationController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let readNotificationUseCase: ReadNotificationUseCase
  let fetchUserUnreadNotificationAmountUseCase: FetchUserUnreadNotificationAmountUseCase
  let notificationsRepository: RedisNotificationRepository

  beforeAll(async () => {
    redisClient.connect()
    await createIndex()
    redisClient.close()
  })

  beforeEach(() => {
    // Server setup
    socketServer = new SocketIOServer(httpServer)

    // App Setup
    notificationsRepository = new RedisNotificationRepository(redisClient)

    readNotificationUseCase = new ReadNotificationUseCase(
      notificationsRepository
    )
    fetchUserUnreadNotificationAmountUseCase =
      new FetchUserUnreadNotificationAmountUseCase(notificationsRepository)

    readNotificationController = new ReadNotificationController(
      socketServer,
      readNotificationUseCase,
      fetchUserUnreadNotificationAmountUseCase
    )

    // App start
    socketServer.setup([readNotificationController])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`
  })

  afterEach(() => {
    httpServer.close()
  })

  test('[user-notification:read]', async () => {
    const firstNotification = makeNotification()
    const secondNotification = makeNotification()

    await Promise.all([
      redisClient.json.set(
        `notification:${firstNotification.id.value}`,
        '$',
        RedisNotificationMapper.toRedis(firstNotification)
      ),
      redisClient.json.set(
        `notification:${secondNotification.id.value}`,
        '$',
        RedisNotificationMapper.toRedis(secondNotification)
      ),
    ])

    const clientSocket = Client(socketServerURL)
    clientSocket.emit('join', '400400')
    await vi.waitFor(() => {
      expect(clientSocket.connected).toBeTruthy()
    })

    const globalAmount = new Promise<{ unreadAmount: number }>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error('[TEST] Test timeout: No global:amount event received')
          )
        }, 100)

        clientSocket.once('global:amount', (payload) => {
          clearTimeout(timeout)
          resolve(payload)
        })
      }
    )

    clientSocket.emit('user-notification:read', {
      recipientId: '400400',
      notificationId: secondNotification.id.value,
    })

    const { unreadAmount } = await globalAmount

    expect(unreadAmount).toEqual(1)
  })
})
