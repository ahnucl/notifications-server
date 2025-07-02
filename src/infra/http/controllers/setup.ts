import { ReadNotification } from './read-notification.controller'
import {
  CreateMonitoringItemCommentNotificationController,
  SocketEmitter,
} from './create-monitoring-item-comment-notification.controller'
import { RetrieveUserNotificationAmount } from './retreive-user-notification-amount.controller'
import { RetrieveMonitoringItemCommentNotificationsController } from './retrieve-monitoring-item-comment-notifications.controller'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { MonitoringItemCommentMetadataFactory } from '@/infra/metadata/monitoring-item-comment-metadata-factory'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { Controller } from './controller'

export function setupControllers(emitter: SocketEmitter): Controller[] {
  const repository = new InMemoryNotificationRepository()
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
