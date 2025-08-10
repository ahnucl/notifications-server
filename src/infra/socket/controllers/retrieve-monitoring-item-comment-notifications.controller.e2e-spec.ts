import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { RedisNotificationMapper } from '@/infra/database/redis/mappers/redis-notification-mapper'
import { makeClient } from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { httpServer } from '@/infra/http/server'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { AddressInfo } from 'node:net'
import { RedisClientType } from 'redis'
import { io as Client } from 'socket.io-client'
import { makeNotification } from 'test/factories/make-notification'
import { SocketIOServer } from '../socketio/socket-io-server'
import { RetrieveMonitoringItemCommentNotificationsController } from './retrieve-monitoring-item-comment-notifications.controller'

describe('Retrieve user Monitoring Item Comment notifications (E2E)', () => {
  let retrieveMonitoringItemCommentNotificationsController: RetrieveMonitoringItemCommentNotificationsController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let fetchUserUnreadNotificationsByTypeUseCase: FetchUserUnreadNotificationsByTypeUseCase
  let metadataFactory: MonitoringItemCommentMetadataFactory
  let notificationsRepository: RedisNotificationRepository
  let redis: RedisClientType

  beforeEach(async () => {
    // Server setup
    socketServer = new SocketIOServer(httpServer)

    // App Setup
    redis = makeClient()

    metadataFactory = new MonitoringItemCommentMetadataFactory()
    notificationsRepository = new RedisNotificationRepository(redis)

    fetchUserUnreadNotificationsByTypeUseCase =
      new FetchUserUnreadNotificationsByTypeUseCase(
        notificationsRepository,
        metadataFactory
      )

    retrieveMonitoringItemCommentNotificationsController =
      new RetrieveMonitoringItemCommentNotificationsController(
        socketServer,
        fetchUserUnreadNotificationsByTypeUseCase
      )

    // App start
    socketServer.setup([retrieveMonitoringItemCommentNotificationsController])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`
  })

  afterEach(() => {
    httpServer.close()
  })

  test('[monitoringItemComment:retrieve]', async () => {
    const monitoringItemCommentUnreadNotification = makeNotification({
      metadata: metadataFactory.produce({
        primaryKeyValue: 1,
        auxiliarFieldValue: 0,
      }),
    })
    const monitoringItemCommentReadNotification = makeNotification({
      readAt: new Date(),
      metadata: metadataFactory.produce({
        primaryKeyValue: 1,
        auxiliarFieldValue: 1,
      }),
    })
    const noneUnreadNotification = makeNotification()

    await redis.json.set(
      `notification:${monitoringItemCommentUnreadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(monitoringItemCommentUnreadNotification)
    )
    await redis.json.set(
      `notification:${monitoringItemCommentReadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(monitoringItemCommentReadNotification)
    )
    await redis.json.set(
      `notification:${noneUnreadNotification.id.value}`,
      '$',
      RedisNotificationMapper.toRedis(noneUnreadNotification)
    )

    const clientSocket = Client(socketServerURL)
    clientSocket.emit('join', '400400')
    await vi.waitFor(() => {
      expect(clientSocket.connected).toBeTruthy()
    })

    const monitoringItemCommentNotifications = new Promise<
      {
        id: string
        recipientId: string
        type: MetadataType
        primaryKey: string | number
        auxiliarKey: string | number | undefined
      }[]
    >((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error(
            '[TEST] Test timeout: No monitoringItemComment:notifications event received'
          )
        )
      }, 100)

      clientSocket.once('monitoringItemComment:notifications', (payload) => {
        clearTimeout(timeout)
        resolve(payload)
      })
    })

    clientSocket.emit('monitoringItemComment:retrieve', {
      recipientId: '400400',
    })

    const notifications = await monitoringItemCommentNotifications

    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('monitoringItemComment')
    expect(notifications[0].recipientId).toBe('400400')
  })
})
