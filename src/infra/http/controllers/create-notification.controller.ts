import { CreateNotificationUseCase } from '@/domain/application/use-cases/create-notification'
import { FetchUserNotificationsUseCase } from '@/domain/application/use-cases/fetch-user-notifications'
import { Context } from '@/domain/value-objects/context'
import { MonitoringItem } from '@/infra/resources/monitoring-item'

// TODO: Create CONTROLLER
export class CreateNotificationController {
  constructor(
    private createNotification: CreateNotificationUseCase,
    private fetchUserNotifications: FetchUserNotificationsUseCase
  ) {}

  async handle() {
    const context = new Context({ resource: MonitoringItem })
    const recipientId = '400400' // TODO: Get from request

    const [, createError] = await this.createNotification.execute({
      recipientId,
      context,
    })

    if (createError) {
      return // or throw something
    }

    const [userNotifications, fetchError] =
      await this.fetchUserNotifications.execute({ recipientId })

    if (fetchError) {
      return // or throw something
    }

    return userNotifications
  }
}
