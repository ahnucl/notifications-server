import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { Controller } from '../controller'
import { SocketEmitter } from '../emitter'

interface RetrieveUserNotificationAmountPayload {
  recipientId: string
}

export class RetrieveUserNotificationAmount extends Controller {
  constructor(
    emitter: SocketEmitter,
    private fetchUserUnreadNotificationUnreadAmount: FetchUserUnreadNotificationAmountUseCase
  ) {
    const path = 'user-notification:amount'
    super({ path, emitter })
  }
  async handle({ recipientId }: RetrieveUserNotificationAmountPayload) {
    const [notificationAmount, error] =
      await this.fetchUserUnreadNotificationUnreadAmount.execute({
        recipientId,
      })

    if (error) {
      throw error
    }

    this.emitter.toUser(recipientId, {
      name: 'global:amount',
      payload: notificationAmount,
    })
  }
}
