import { Controller } from '../socket/controller'
import { CreateMonitoringItemCommentNotificationController } from '../socket/controllers/create-monitoring-item-comment-notification.controller'
import { ReadNotificationController } from '../socket/controllers/read-notification.controller'
import { RetrieveUserNotificationAmountController } from '../socket/controllers/retreive-user-notification-amount.controller'
import { RetrieveMonitoringItemCommentNotificationsController } from '../socket/controllers/retrieve-monitoring-item-comment-notifications.controller'
import { SocketEmitter } from '../socket/emitter'
import { AppUseCases } from './interfaces'

export function setupControllers(
  { shared, monitoringItemComments }: AppUseCases,
  emitter: SocketEmitter
): Controller[] {
  const controllers = [
    new ReadNotificationController(
      emitter,
      shared.readNotification,
      shared.fetchUserUnreadNotificationAmount
    ),
    new CreateMonitoringItemCommentNotificationController(
      emitter,
      monitoringItemComments.createMonitoringItemCommentNotification,
      shared.fetchUserUnreadNotificationAmount,
      monitoringItemComments.fetchUserUnreadMonitoringItemCommentNotifications
    ),
    new RetrieveUserNotificationAmountController(
      emitter,
      shared.fetchUserUnreadNotificationAmount
    ),
    new RetrieveMonitoringItemCommentNotificationsController(
      emitter,
      monitoringItemComments.fetchUserUnreadMonitoringItemCommentNotifications
    ),
  ]

  return controllers
}
