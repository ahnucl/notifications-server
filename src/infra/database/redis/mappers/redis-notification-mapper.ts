import { Notification } from '@/domain/entities/notification'
import { EntityID } from '@/domain/value-objects/entity-id'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

export type RedisNotification = {
  id: string
  recipientId: string
  createdAt: string
  readAt: string | '_null' // Workaround for querying null values on JSON documents
  metadata: {
    type: string
    name: string
    primaryKey: {
      name: string
      value: string | number
    }
    auxiliarField?: {
      name: string
      value: string | number
    }
  }
}

export class RedisNotificationMapper {
  static toRedis(notification: Notification) {
    const raw: RedisNotification = {
      id: notification.id.value,
      recipientId: notification.recipientId,
      createdAt: notification.createdAt.toString(),
      readAt: notification.readAt?.toISOString() || '_null',
      metadata: {
        type: notification.type,
        name: notification.sourceData.name,
        primaryKey: {
          name: notification.sourceData.primaryKey,
          value: notification.primaryId,
        },
      },
    }

    if (
      (notification.auxiliarId || notification.auxiliarId === 0) &&
      notification.sourceData.auxiliarField
    ) {
      raw.metadata.auxiliarField = {
        name: notification.sourceData.auxiliarField,
        value: notification.auxiliarId,
      }
    }

    return raw
  }

  static toDomain(raw: RedisNotification): Notification {
    return new Notification(
      {
        recipientId: raw.recipientId,
        createdAt: new Date(raw.createdAt),
        readAt: raw.readAt == '_null' ? null : new Date(raw.readAt),
        metadata: {
          name: raw.metadata.name,
          type: raw.metadata.type as MetadataType,
          primaryKey: raw.metadata.primaryKey,
          auxiliarField: raw.metadata.auxiliarField,
        },
      },
      new EntityID(raw.id)
    )
  }
}
