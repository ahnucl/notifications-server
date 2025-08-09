import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { RedisNotificationMapper } from '@/infra/database/redis/mappers/redis-notification-mapper'
import { createIndex, makeClient } from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { httpServer } from '@/infra/http/server'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { MetadataFactoryRegistry } from '@/infra/metadata/registry'
import { AddressInfo } from 'node:net'
import { RedisClientType } from 'redis'
import { io as Client } from 'socket.io-client'
import { makeNotification } from 'test/factories/make-notification'
import { TestMetadataFactory } from 'test/metadata/testing-metadata-factory'
import { SocketIOServer } from '../socketio/socket-io-server'
import { ReadNotificationController } from './read-notification.controller'

describe('Read a notification (E2E)', () => {
  let readNotificationController: ReadNotificationController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let readNotificationUseCase: ReadNotificationUseCase
  let fetchUserUnreadNotificationAmountUseCase: FetchUserUnreadNotificationAmountUseCase
  let fetchUserUnreadNotificationsByTypeUseCase: FetchUserUnreadNotificationsByTypeUseCase
  let metadataFactoryRegistry: MetadataFactoryRegistry
  let notificationsRepository: RedisNotificationRepository
  let redis: RedisClientType
  let metadataFactory: MetadataFactory

  // beforeAll(async () => {
  //   redis = makeClient()
  //   await redis.connect()
  //   await createIndex(redis)
  //   await redis.close()
  // })

  beforeEach(async () => {
    redis = makeClient()
    await redis.connect()
    await createIndex(redis)
    await redis.close()

    // const env = getEnv()
    // console.log('env', env)
    // console.log('process.env.REDIS_PORT', process.env.REDIS_PORT)
    // return 0

    // Server setup
    socketServer = new SocketIOServer(httpServer)

    // App Setup
    metadataFactory = new MonitoringItemCommentMetadataFactory()

    notificationsRepository = new RedisNotificationRepository(redis)
    metadataFactoryRegistry = new MetadataFactoryRegistry({
      monitoringItemComment: new MonitoringItemCommentMetadataFactory(),
      none: new TestMetadataFactory(),
    })

    readNotificationUseCase = new ReadNotificationUseCase(
      notificationsRepository
    )
    fetchUserUnreadNotificationAmountUseCase =
      new FetchUserUnreadNotificationAmountUseCase(notificationsRepository)
    fetchUserUnreadNotificationsByTypeUseCase =
      new FetchUserUnreadNotificationsByTypeUseCase(
        notificationsRepository,
        null
      )
    readNotificationController = new ReadNotificationController(
      socketServer,
      readNotificationUseCase,
      fetchUserUnreadNotificationAmountUseCase,
      fetchUserUnreadNotificationsByTypeUseCase,
      metadataFactoryRegistry
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
    const thirdNotification = makeNotification({
      metadata: metadataFactory.produce({
        primaryKeyValue: 1,
        auxiliarFieldValue: 0,
      }),
    })

    await Promise.all([
      redis.json.set(
        `notification:${firstNotification.id.value}`,
        '$',
        RedisNotificationMapper.toRedis(firstNotification)
      ),
      redis.json.set(
        `notification:${secondNotification.id.value}`,
        '$',
        RedisNotificationMapper.toRedis(secondNotification)
      ),
      redis.json.set(
        `notification:${thirdNotification.id.value}`,
        '$',
        RedisNotificationMapper.toRedis(thirdNotification)
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

    const unreadNotificationsOfTypeNone = new Promise<Notification[]>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error(
              '[TEST] Test timeout: No none:notifications event received'
            )
          )
        }, 100)

        clientSocket.once('none:notifications', (payload) => {
          clearTimeout(timeout)
          resolve(payload)
        })
      }
    )

    const unreadNotificationsOfOtherType = new Promise<Error>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          resolve(
            new Error(
              '[TEST] Test timeout: No monitoringItemComment:notifications event received'
            )
          )
        }, 100)

        clientSocket.once('monitoringItemComment:notifications', (payload) => {
          clearTimeout(timeout)
          reject(payload)
        })
      }
    )

    clientSocket.emit('user-notification:read', {
      recipientId: '400400',
      notificationId: secondNotification.id.value,
    })

    const [
      { unreadAmount },
      notificationsOfTypeNone,
      notificationsOfOtherType,
    ] = await Promise.all([
      globalAmount,
      unreadNotificationsOfTypeNone,
      unreadNotificationsOfOtherType,
    ])

    expect(unreadAmount).toEqual(2) // One of type none, one of type monitoringItemComment
    expect(notificationsOfTypeNone).toHaveLength(1)
    expect(notificationsOfTypeNone[0].id).toBe(firstNotification.id.value)
    expect(notificationsOfOtherType).toBeInstanceOf(Error)
  })
})
