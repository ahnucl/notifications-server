import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserNotificationsWithTypeUseCase } from '@/domain/application/use-cases/fetch-user-notifications-with-type'

interface CreateMonitoringItemCommentNotificationPayload {
  recipientId: string
  monitoringItemId: number
  commentIndex: number
}

export class CreateMonitoringItemCommentNotificationController {
  constructor(
    readonly path = 'monitoringItemComment:create',
    private createNotification: CreateNotificationUseCase,
    private fetchUserNotificationsWithType: FetchUserNotificationsWithTypeUseCase
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
      await this.fetchUserNotificationsWithType.execute({ recipientId })

    if (fetchError) {
      return // or throw something
    }

    return userNotifications
  }
}
