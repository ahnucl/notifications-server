import { Optional } from '@/types/optional'
import { EntityID } from '../value-objects/entity-id'
import { Metadata } from '../value-objects/metadata/notificataion-metadata'

interface NotificationProps {
  recipientId: string
  createdAt: Date
  readAt?: Date | null
  metadata: Metadata
}

export class Notification {
  private id: EntityID
  readonly recipientId: string
  private createdAt: Date
  private readAt?: Date | null
  private metadata: Metadata

  constructor(props: Optional<NotificationProps, 'createdAt'>, id?: EntityID) {
    this.id = id ?? new EntityID()
    this.recipientId = props.recipientId
    this.createdAt = props.createdAt || new Date()
    this.readAt = props.readAt
    this.metadata = props.metadata
  }

  public read() {
    this.readAt = new Date()
  }

  public getType() {
    return this.metadata.type
  }
}
