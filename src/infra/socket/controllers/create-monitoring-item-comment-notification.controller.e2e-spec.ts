import { httpServer } from '@/infra/http/server'
import { SocketIOServer } from '../socketio/socket-io-server'
import { CreateMonitoringItemCommentNotificationController } from './create-monitoring-item-comment-notification.controller'
import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { AddressInfo } from 'node:net'
import { client as redisClient } from '@/infra/database/redis/redis.service'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'

describe('Create a Monitoring Item Comment notification (E2E)', () => {
  let createMonitoringItemCommentNotificationController: CreateMonitoringItemCommentNotificationController
  let socketServerURL: string
  let socketServer: SocketIOServer
  let createNotificationUseCase: CreateNotificationUseCase
  let fetchUserUnreadNotificationAmountUseCase: FetchUserUnreadNotificationAmountUseCase
  let fetchUserUnreadNotificationsByTypeUseCase: FetchUserUnreadNotificationsByTypeUseCase
  let metadataFactory: MonitoringItemCommentMetadataFactory
  let notificationsRepository: RedisNotificationRepository

  beforeEach(() => {
    // Server setup
    socketServer = new SocketIOServer(httpServer)
    socketServer.setup([])
    httpServer.listen()

    const { port } = httpServer.address() as AddressInfo
    socketServerURL = `http://localhost:${port}`

    // App Setup
    metadataFactory = new MonitoringItemCommentMetadataFactory()
    notificationsRepository = new RedisNotificationRepository(redisClient)

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
  })

  afterEach(() => {
    httpServer.close()
  })
})
