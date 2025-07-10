import { Notification } from '@/domain/entities/notification'

export class UnreadNotificationsPresenter {
  static toSocket(notificataion: Notification) {
    return {
      id: notificataion.id,
      recipientId: notificataion.recipientId,
      type: notificataion.type,
      primaryKey: notificataion.primaryId,
      auxiliarKey: notificataion.auxiliarId,
    }
  }
}
