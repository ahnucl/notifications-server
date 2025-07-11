import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { Controller } from '../controller'
import { SocketEmitter } from '../emitter'
import { UnreadNotificationsPresenter } from '../presenters/unread-notifications-presenter'

interface RetrieveMonitoringItemCommentNotificationsPayload {
  recipientId: string
}

export class RetrieveMonitoringItemCommentNotificationsController extends Controller {
  constructor(
    emitter: SocketEmitter,
    private fetchUserUnreadNotificationsByType: FetchUserUnreadNotificationsByTypeUseCase
  ) {
    const path = 'monitoringItemComment:retrieve'
    super({ path, emitter })
  }

  async handle({
    recipientId,
  }: RetrieveMonitoringItemCommentNotificationsPayload) {
    const [notifications, error] =
      await this.fetchUserUnreadNotificationsByType.execute({
        recipientId,
      })

    if (error) throw error

    this.emitter.toUser(recipientId, {
      name: 'monitoringItemComment:notifications',
      payload: notifications.unreadNotifications.map(
        UnreadNotificationsPresenter.toSocket
      ),
    })
  }
}
