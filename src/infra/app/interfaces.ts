import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { RedisNotificationRepository } from '../database/redis/repositories/redis-notification-repository'
import { MonitoringItemCommentMetadataFactory } from '../metadata/monitoring-item-comment-metadata-factory'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'

export interface AppServices {
  repository: RedisNotificationRepository
  monitoringItemCommentMetadataFactory: MonitoringItemCommentMetadataFactory
}

export interface AppUseCases {
  shared: {
    readNotification: ReadNotificationUseCase
    fetchUserUnreadNotificationAmount: FetchUserUnreadNotificationAmountUseCase
  }
  monitoringItemComments: {
    createMonitoringItemCommentNotification: CreateNotificationUseCase
    fetchUserUnreadMonitoringItemCommentNotifications: FetchUserUnreadNotificationsByTypeUseCase
  }
}
