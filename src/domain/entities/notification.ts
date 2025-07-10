import { EntityID } from '../value-objects/entity-id'
import { Metadata } from '../value-objects/metadata/notificataion-metadata'

export interface NotificationProps {
  recipientId: string
  createdAt?: Date
  readAt?: Date | null
  metadata: Metadata
}

export class Notification {
  private _id: EntityID
  readonly recipientId: string
  private _createdAt: Date
  private _readAt?: Date | null
  private metadata: Metadata

  constructor(props: NotificationProps, id?: EntityID) {
    this._id = id ?? new EntityID()
    this.recipientId = props.recipientId
    this._createdAt = props.createdAt || new Date()
    this._readAt = props.readAt
    this.metadata = props.metadata
  }

  get id() {
    return this._id
  }

  get readAt() {
    return this._readAt
  }

  get createdAt() {
    return this._createdAt
  }

  get primaryId() {
    return this.metadata.primaryKey.value
  }

  get auxiliarId() {
    return this.metadata.auxiliarField?.value
  }

  get type() {
    return this.metadata.type
  }

  get sourceData() {
    return {
      name: this.metadata.name,
      primaryKey: this.metadata.primaryKey.name,
      auxiliarField: this.metadata.auxiliarField?.name,
    }
  }
  public read() {
    this._readAt = new Date()
  }
}
