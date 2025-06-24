import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

export abstract class NotificationRepository {
  abstract findManyByUserId(idUser: string): Promise<Notification[]>
  abstract getUsersUnreadAmount(idUser: string): Promise<number>
  abstract findManyUnreadByUserAndType(
    idUser: string,
    type: MetadataType
  ): Promise<Notification[]>
  abstract create(notification: Notification): Promise<void>
}
