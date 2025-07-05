import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { client } from '@/infra/database/redis/redis.service'
import { RedisNotificationRepository } from '@/infra/database/redis/repositories/redis-notification-repository'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { Controller } from './controller'
import { CreateMonitoringItemCommentNotificationController } from './controllers/create-monitoring-item-comment-notification.controller'
import { ReadNotification } from './controllers/read-notification.controller'
import { RetrieveUserNotificationAmount } from './controllers/retreive-user-notification-amount.controller'
import { RetrieveMonitoringItemCommentNotificationsController } from './controllers/retrieve-monitoring-item-comment-notifications.controller'
import { SocketEmitter } from './emitter'

export function setupControllers(emitter: SocketEmitter): Controller[] {
  const repository = new RedisNotificationRepository(client)
  const monitoringItemCommentMetadataFactory =
    new MonitoringItemCommentMetadataFactory()

  const readNotification = new ReadNotificationUseCase(repository)
  const fetchUserUnreadNotificationAmount =
    new FetchUserUnreadNotificationAmountUseCase(repository)
  const createMonitoringItemCommentNotification = new CreateNotificationUseCase(
    repository,
    monitoringItemCommentMetadataFactory
  )
  const fetchUserUnreadMonitoringItemCommentNotifications =
    new FetchUserUnreadNotificationsByTypeUseCase(
      repository,
      monitoringItemCommentMetadataFactory
    )

  const controllers = [
    new ReadNotification(
      emitter,
      readNotification,
      fetchUserUnreadNotificationAmount
    ),
    new CreateMonitoringItemCommentNotificationController(
      emitter,
      createMonitoringItemCommentNotification,
      fetchUserUnreadNotificationAmount,
      fetchUserUnreadMonitoringItemCommentNotifications
    ),
    new RetrieveUserNotificationAmount(
      emitter,
      fetchUserUnreadNotificationAmount
    ),
    new RetrieveMonitoringItemCommentNotificationsController(
      emitter,
      fetchUserUnreadMonitoringItemCommentNotifications
    ),
  ]

  return controllers
}
