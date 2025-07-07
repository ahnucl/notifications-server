import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { SocketEmitter } from '../emitter'
import { Controller } from '../controller'

interface ReadNotificationPayload {
  recipientId: string
  notificationId: string
}

export class ReadNotification extends Controller {
  constructor(
    emitter: SocketEmitter,
    private readNotification: ReadNotificationUseCase,
    private fetchUserUnreadNotificationAmount: FetchUserUnreadNotificationAmountUseCase
  ) {
    const path = 'user-notification:read'
    super({ path, emitter })
  }
  async handle({ recipientId, notificationId }: ReadNotificationPayload) {
    const [, readError] = await this.readNotification.execute({
      notificationId,
      recipientId,
    })

    if (readError) throw readError

    const [response, amountError] =
      await this.fetchUserUnreadNotificationAmount.execute({
        recipientId,
      })

    if (amountError) throw amountError

    this.emitter.toUser(recipientId, {
      name: 'global:amount',
      payload: response,
    })
  }
}
