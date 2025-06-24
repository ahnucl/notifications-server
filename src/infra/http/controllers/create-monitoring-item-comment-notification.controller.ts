import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserNotificationsUseCase } from '@/domain/application/use-cases/fetch-user-notifications'

interface CreateMonitoringItemCommentNotificationPayload {
  recipientId: string
  monitoringItemId: number
  commentIndex: number
}

export class CreateMonitoringItemCommentNotificationController {
  constructor(
    readonly path = 'monitoringItemComment:create',
    private createNotification: CreateNotificationUseCase,
    private fetchUserNotifications: FetchUserNotificationsUseCase
  ) {}

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

    if (createError) {
      return // or throw something
    }

    const [userNotifications, fetchError] =
      await this.fetchUserNotifications.execute({ recipientId })

    if (fetchError) {
      return // or throw something
    }

    // const [] = await this.

    return userNotifications
  }
}
