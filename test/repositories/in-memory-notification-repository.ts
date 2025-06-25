import { NotificationRepository } from '@/domain/application/repositories/notification-repository'
import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

export class InMemoryNotificationRepository extends NotificationRepository {
  public notifications: Notification[] = []

  async findManyByUserId(idUser: string): Promise<Notification[]> {
    return this.notifications.filter(
      (notification) => notification.recipientId === idUser
    )
  }

  async getUsersUnreadAmount(idUser: string): Promise<number> {
    return this.notifications.filter(
      (notification) =>
        notification.recipientId === idUser && !notification.readAt
    ).length
  }

  async findManyUnreadByUserAndType(
    idUser: string,
    type: MetadataType
  ): Promise<Notification[]> {
    return this.notifications.filter(
      (notification) =>
        notification.recipientId === idUser &&
        notification.getType() === type &&
        !notification.readAt
    )
  }

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }
}
