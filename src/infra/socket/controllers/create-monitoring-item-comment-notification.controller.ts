import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { SocketEmitter } from '../emitter'
import { Controller } from '../controller'

interface CreateMonitoringItemCommentNotificationPayload {
  recipientId: string
  monitoringItemId: number
  commentIndex: number
}

export class CreateMonitoringItemCommentNotificationController extends Controller {
  constructor(
    emitter: SocketEmitter,
    private createNotification: CreateNotificationUseCase,
    private fetchUserUnreadNotificationAmount: FetchUserUnreadNotificationAmountUseCase,
    private fetchUserUnreadNotificationsByType: FetchUserUnreadNotificationsByTypeUseCase
  ) {
    const path = 'monitoringItemComment:create'
    super({ path, emitter })
  }

  async handle({
    recipientId,
    monitoringItemId,
    commentIndex,
  }: CreateMonitoringItemCommentNotificationPayload) {
    const [, createError] = await this.createNotification.execute({
      recipientId,
      primaryKeyValue: monitoringItemId,
      auxiliarFieldValue: commentIndex,
    })

    if (createError) throw createError

    const userNotificationsPromise =
      this.fetchUserUnreadNotificationsByType.execute({
        recipientId,
      })
    const userNotificationsAmountPromise =
      this.fetchUserUnreadNotificationAmount.execute({ recipientId })
    const [
      [userNotifications, userNotificationsError],
      [userNotificationsAmount, userNotificationsAmountError],
    ] = await Promise.all([
      userNotificationsPromise,
      userNotificationsAmountPromise,
    ])

    if (userNotificationsError) throw userNotificationsError

    if (userNotificationsAmountError) throw userNotificationsAmountError

    this.emitter.toUser(recipientId, {
      name: 'global:amount',
      payload: userNotificationsAmount,
    })

    this.emitter.toUser(recipientId, {
      name: 'monitoringItemComment:notifications',
      payload: userNotifications.unreadNotifications,
    })
  }
}
