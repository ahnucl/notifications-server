import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { AppServices, AppUseCases } from './interfaces'

export function setupUseCases({
  repository,
  monitoringItemCommentMetadataFactory,
}: AppServices): AppUseCases {
  // Global Use Cases
  const readNotification = new ReadNotificationUseCase(repository)
  const fetchUserUnreadNotificationAmount =
    new FetchUserUnreadNotificationAmountUseCase(repository)

  // Monitoring Item Comment Use Cases
  const createMonitoringItemCommentNotification = new CreateNotificationUseCase(
    repository,
    monitoringItemCommentMetadataFactory
  )
  const fetchUserUnreadMonitoringItemCommentNotifications =
    new FetchUserUnreadNotificationsByTypeUseCase(
      repository,
      monitoringItemCommentMetadataFactory
    )

  //
  return {
    shared: {
      readNotification,
      fetchUserUnreadNotificationAmount,
    },
    monitoringItemComments: {
      createMonitoringItemCommentNotification,
      fetchUserUnreadMonitoringItemCommentNotifications,
    },
  }
}
