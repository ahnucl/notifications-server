import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { Notification } from '@/domain/entities/notification'
import { createIndex, makeClient } from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { httpServer } from '@/infra/http/server'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { AddressInfo } from 'node:net'
import { RedisClientType, SearchReply } from 'redis'
import { io as Client } from 'socket.io-client'
import { SocketIOServer } from '../socketio/socket-io-server'
import { CreateMonitoringItemCommentNotificationController } from './create-monitoring-item-comment-notification.controller'

describe('Create a Monitoring Item Comment notification (E2E)', () => {
  let createMonitoringItemCommentNotificationController: CreateMonitoringItemCommentNotificationController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let createNotificationUseCase: CreateNotificationUseCase
  let fetchUserUnreadNotificationAmountUseCase: FetchUserUnreadNotificationAmountUseCase
  let fetchUserUnreadNotificationsByTypeUseCase: FetchUserUnreadNotificationsByTypeUseCase
  let metadataFactory: MonitoringItemCommentMetadataFactory
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
    metadataFactory = new MonitoringItemCommentMetadataFactory()
    notificationsRepository = new RedisNotificationRepository(redis)

    createNotificationUseCase = new CreateNotificationUseCase(
      notificationsRepository,
      metadataFactory
    )
    fetchUserUnreadNotificationAmountUseCase =
      new FetchUserUnreadNotificationAmountUseCase(notificationsRepository)

    fetchUserUnreadNotificationsByTypeUseCase =
      new FetchUserUnreadNotificationsByTypeUseCase(
        notificationsRepository,
        metadataFactory
      )

    createMonitoringItemCommentNotificationController =
      new CreateMonitoringItemCommentNotificationController(
        socketServer,
        createNotificationUseCase,
        fetchUserUnreadNotificationAmountUseCase,
        fetchUserUnreadNotificationsByTypeUseCase
      )

    // App start
    socketServer.setup([createMonitoringItemCommentNotificationController])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`
  })

  afterEach(() => {
    httpServer.close()
  })

  test('[monitoringItemComment:create]', async () => {
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

    const monitoringItemCommentNotifications = new Promise<Notification[]>(
      (resolve, reject) => {
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
      }
    )

    clientSocket.emit('monitoringItemComment:create', {
      recipientId: '400400',
      monitoringItemId: 1,
      commentIndex: 0,
    })

    const [{ unreadAmount }, notifications] = await Promise.all([
      globalAmount,
      monitoringItemCommentNotifications,
    ])

    const userUnreadNotificationsOnDatabase = (await redis.ft.search(
      'idx:notifications',
      '400400 @type:"monitoringItemComment" @readAt:"_null"'
    )) as SearchReply | null

    expect(userUnreadNotificationsOnDatabase?.documents[0].value).toBeTruthy()

    expect(userUnreadNotificationsOnDatabase?.documents[0].value).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        recipientId: '400400',
        readAt: '_null',
        metadata: {
          type: 'monitoringItemComment',
          name: 'tb_monitoracao_item',
          primaryKey: { name: 'cd_monitoracao_item', value: 1 },
          auxiliarField: { name: 'js_observacao', value: 0 },
        },
      })
    )

    expect(unreadAmount).toEqual(1)
    expect(notifications).toHaveLength(1)
    expect(notifications[0].type).toBe('monitoringItemComment')
    expect(notifications[0].recipientId).toBe('400400')
  })
})
