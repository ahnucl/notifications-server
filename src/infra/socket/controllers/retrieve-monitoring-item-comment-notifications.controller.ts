import { FetchUserUnreadNotificationsByTypeUseCase } from '@/domain/application/use-cases/fetch-user-unread-notifications-by-type'
import { Controller } from './controller'

interface RetrieveMonitoringItemCommentNotificationsPayload {
  recipientId: string
}

export interface SocketEmitter<T = unknown> {
  toUser(userId: string, event: AppEvent<T>): void
}

export interface AppEvent<T = unknown> {
  name: DispatchEvent
  payload: T
}

type DispatchEvent = 'global:amount' | 'monitoringItemComment:notifications'

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
      payload: notifications.unreadNotifications,
    })
  }
}
