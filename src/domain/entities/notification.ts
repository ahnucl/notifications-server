import { Optional } from '@/types/optional'
import { EntityID } from '@/domain/value-objects/entity-id'
import { Context } from '../value-objects/context'

interface NotificationProps {
  recipientId: string
  createdAt: Date
  readAt?: Date | null
  context: Context
}

export class Notification {
  private id: EntityID
  readonly recipientId: string
  private createdAt: Date
  private readAt?: Date | null
  private context: Context

  constructor(props: Optional<NotificationProps, 'createdAt'>, id?: EntityID) {
    this.id = id ?? new EntityID()
    this.recipientId = props.recipientId
    this.createdAt = props.createdAt || new Date()
    this.readAt = props.readAt
    this.context = props.context
  }

  public read() {
    this.readAt = new Date()
  }

  private test() {
    console.log(this.context.getResourceName())
  }
}
