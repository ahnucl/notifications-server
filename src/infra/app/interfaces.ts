import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { RedisNotificationRepository } from '../database/redis/repositories/redis-notification-repository'
import { MonitoringItemCommentMetadataFactory } from '../metadata/monitoring-item-comment-metadata-factory'
import { MetadataFactoryRegistry } from '../metadata/registry'

export interface AppServices {
  repository: RedisNotificationRepository
  monitoringItemCommentMetadataFactory: MonitoringItemCommentMetadataFactory
  metadataRegistry: MetadataFactoryRegistry
}

export interface AppUseCases {
  shared: {
    readNotification: ReadNotificationUseCase
    fetchUserUnreadNotificationAmount: FetchUserUnreadNotificationAmountUseCase
    fetchUserUnreadNotifications: FetchUserUnreadNotificationsByTypeUseCase
  }
  monitoringItemComments: {
    createMonitoringItemCommentNotification: CreateNotificationUseCase
    fetchUserUnreadMonitoringItemCommentNotifications: FetchUserUnreadNotificationsByTypeUseCase
  }
}
