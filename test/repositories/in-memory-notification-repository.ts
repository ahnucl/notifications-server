import { NotificationRepository } from '@/domain/application/repositories/notification-repository'
import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { Metadata } from '@/domain/value-objects/metadata/notificataion-metadata'

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

  async findManyUnreadByType(
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

  async findById(id: string): Promise<Notification | null> {
    const notification = this.notifications.find(
      (notification) => notification.id.value === id
    )

    if (!notification) return null

    const metadata: Metadata = {
      type: 'none',
      name: '',
      primaryKey: {
        name: '',
        value: notification.primaryId,
      },
    }

    if (notification.auxiliarId) {
      metadata.auxiliarField = {
        name: '',
        value: notification.auxiliarId,
      }
    }

    return new Notification(
      {
        metadata,
        recipientId: notification.recipientId,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
      },
      notification.id
    )
  }

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const index = this.notifications.findIndex(
      (item) => item.id === notification.id
    )

    if (index >= 0) {
      this.notifications[index] = notification
    }
  }
}
