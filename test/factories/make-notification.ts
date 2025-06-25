import { Notification, NotificationProps } from '@/domain/entities/notification'
import { EntityID } from '@/domain/value-objects/entity-id'
import { Metadata } from '@/domain/value-objects/metadata/notificataion-metadata'

export function makeNotification(
  propsOverride: Partial<NotificationProps> = {},
  id?: EntityID
) {
  const metadata: Metadata = {
    type: 'none',
    name: '',
    primaryKey: {
      name: '',
      value: '',
    },
    // Existence Should be random
    auxiliarField: {
      name: '',
      value: '',
    },
  }

  const notification = new Notification(
    {
      metadata,
      recipientId: '400400',
      ...propsOverride,
    },
    id
  )

  return notification
}
