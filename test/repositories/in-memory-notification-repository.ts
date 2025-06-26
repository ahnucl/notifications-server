import {
  NotificationRepository,
  SearchMetadata,
} from '@/domain/application/repositories/notification-repository'
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

  async findByUserAndMetadata(
    idUser: string,
    { type, primaryKeyValue, auxiliarFieldValue }: SearchMetadata
  ): Promise<Notification | null> {
    const notification = this.notifications.find(
      (notification) =>
        notification.recipientId === idUser &&
        notification.getType() === type &&
        notification.primaryId === primaryKeyValue &&
        notification.auxiliarId === auxiliarFieldValue
    )

    if (!notification) return null

    return this.cloneInstance(notification) // Needed because altering the refence bypass the persistence (its the same object)
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

  private cloneInstance(obj: Notification): Notification {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj)
  }
}
