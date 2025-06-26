import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

export interface SearchMetadata {
  primaryKeyValue: string | number
  auxiliarFieldValue?: string | number
  type: MetadataType
}

export abstract class NotificationRepository {
  abstract findManyByUserId(idUser: string): Promise<Notification[]>
  abstract getUsersUnreadAmount(idUser: string): Promise<number>
  abstract findManyUnreadByUserAndType(
    idUser: string,
    type: MetadataType
  ): Promise<Notification[]>
  abstract findByUserAndMetadata(
    idUser: string,
    metadata: SearchMetadata
  ): Promise<Notification | null>
  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
