import { Notification } from '@/domain/entities/notification'
import { Resource } from '@/domain/value-objects/resource'

export abstract class NotificationRepository {
  abstract findManyByUserId(idUser: string): Promise<Notification[]>
  abstract findManyByResource(
    resource: Resource,
    idUser: string
  ): Promise<Notification[]>
  abstract create(notification: Notification): Promise<void>
}
