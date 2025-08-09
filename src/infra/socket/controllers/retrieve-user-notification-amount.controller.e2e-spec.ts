import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { RedisNotificationMapper } from '@/infra/database/redis/mappers/redis-notification-mapper'
import { createIndex, makeClient } from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { httpServer } from '@/infra/http/server'
import { AddressInfo } from 'node:net'
import { RedisClientType } from 'redis'
import { io as Client } from 'socket.io-client'
import { makeNotification } from 'test/factories/make-notification'
import { SocketIOServer } from '../socketio/socket-io-server'
import { RetrieveUserNotificationAmountController } from './retrieve-user-notification-amount.controller'

describe('Retrieve user unread notification amount (E2E)', () => {
  let retrieveUserNotificationAmount: RetrieveUserNotificationAmountController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let fetchUserUnreadNotificationAmountUseCase: FetchUserUnreadNotificationAmountUseCase
  let notificationsRepository: RedisNotificationRepository
  let redis: RedisClientType

  beforeEach(async () => {
    redis = makeClient()
    await redis.connect()
    await createIndex(redis)
    await redis.close()

    // Server setup
    socketServer = new SocketIOServer(httpServer)

    // App Setup
    notificationsRepository = new RedisNotificationRepository(redis)

    fetchUserUnreadNotificationAmountUseCase =
      new FetchUserUnreadNotificationAmountUseCase(notificationsRepository)

    retrieveUserNotificationAmount =
      new RetrieveUserNotificationAmountController(
        socketServer,
        fetchUserUnreadNotificationAmountUseCase
      )

    // App start
    socketServer.setup([retrieveUserNotificationAmount])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`
  })

  afterEach(() => {
    httpServer.close()
  })

  test('[user-notification:amount]', async () => {
    const firstUserUnreadNotification = makeNotification()
    const firstUserReadNotification = makeNotification({ readAt: new Date() })
    const secondUserUnreadNotification = makeNotification({
      recipientId: '500500',
    })

    await redis.json.set(
      `notification:${firstUserUnreadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(firstUserUnreadNotification)
    )
    await redis.json.set(
      `notification:${firstUserReadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(firstUserReadNotification)
    )
    await redis.json.set(
      `notification:${secondUserUnreadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(secondUserUnreadNotification)
    )

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

    clientSocket.emit('user-notification:amount', {
      recipientId: '400400',
    })

    const { unreadAmount } = await globalAmount

    expect(unreadAmount).toEqual(1)
  })
})
