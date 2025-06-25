import { EntityID } from '../value-objects/entity-id'
import { Metadata } from '../value-objects/metadata/notificataion-metadata'

export interface NotificationProps {
  recipientId: string
  createdAt?: Date
  readAt?: Date | null
  metadata: Metadata
}

export class Notification {
  private id: EntityID
  readonly recipientId: string
  private createdAt: Date
  private _readAt?: Date | null
  private metadata: Metadata

  constructor(props: NotificationProps, id?: EntityID) {
    this.id = id ?? new EntityID()
    this.recipientId = props.recipientId
    this.createdAt = props.createdAt || new Date()
    this._readAt = props.readAt
    this.metadata = props.metadata
  }

  get readAt() {
    return this._readAt
  }

  public read() {
    this._readAt = new Date()
  }

  public getType() {
    return this.metadata.type
  }
}
