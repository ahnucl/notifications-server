import { FetchUserUnreadNotificationAmountUseCase } from '@/domain/application/use-cases/fetch-user-unread-notification-amount'
import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { ReadNotificationUseCase } from '@/domain/application/use-cases/read-notification'
import { MetadataFactoryRegistry } from '@/infra/metadata/registry'
import { Controller } from '../controller'
import { SocketEmitter } from '../emitter'
import { UnreadNotificationsPresenter } from '../presenters/unread-notifications-presenter'

interface ReadNotificationPayload {
  recipientId: string
  notificationId: string
}

export class ReadNotificationController extends Controller {
  constructor(
    emitter: SocketEmitter,
    private readNotification: ReadNotificationUseCase,
    private fetchUserUnreadNotificationAmount: FetchUserUnreadNotificationAmountUseCase,
    private fetchUserUnreadNotificationsByType: FetchUserUnreadNotificationsByTypeUseCase,
    private registry: MetadataFactoryRegistry
  ) {
    const path = 'user-notification:read'
    super({ path, emitter })
  }
  async handle({ recipientId, notificationId }: ReadNotificationPayload) {
    const [readNotification, readError] = await this.readNotification.execute({
      notificationId,
      recipientId,
    })
    if (readError) throw readError

    const [userNotificationsAmount, userNotificationsAmountError] =
      await this.fetchUserUnreadNotificationAmount.execute({
        recipientId,
      })

    if (userNotificationsAmountError) throw userNotificationsAmountError

    this.emitter.toUser(recipientId, {
      name: 'global:amount',
      payload: userNotificationsAmount,
    })

    const metadataFactory = this.registry.get(readNotification.type)

    if (metadataFactory) {
      // Should rollback read operation if not found
      // throw new Error(`Factory not found for type ${readNotification.type}`)

      this.fetchUserUnreadNotificationsByType.metadataFactory = metadataFactory

      const [userNotifications, userNotificationsError] =
        await this.fetchUserUnreadNotificationsByType.execute({
          recipientId,
        })

      if (userNotificationsError) throw userNotificationsError

      this.emitter.toUser(recipientId, {
        name: `${readNotification.type}:notifications`,
        payload: userNotifications.unreadNotifications.map(
          UnreadNotificationsPresenter.toSocket
        ),
      })
    }
  }
}
