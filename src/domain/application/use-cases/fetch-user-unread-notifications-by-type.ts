import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserUnreadNotificationsByTypeUseCaseRequest {
  recipientId: string
}

type FetchUserUnreadNotificationsByTypeUseCaseResponse = UseCaseResponse<
  {
    unreadNotifications: Notification[]
    type: MetadataType
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserUnreadNotificationsByTypeUseCase {
  constructor(
    private repository: NotificationRepository,
    private _metadataFactory: MetadataFactory | null
  ) {}

  async execute({
    recipientId,
  }: FetchUserUnreadNotificationsByTypeUseCaseRequest): Promise<FetchUserUnreadNotificationsByTypeUseCaseResponse> {
    if (!this._metadataFactory) {
      return [null, new Error('Notification type not set')]
    }

    const metadataType = this._metadataFactory.type
    const unreadNotifications = await this.repository.findManyUnreadByType(
      recipientId,
      metadataType
    )

    return [{ unreadNotifications, type: metadataType }, null]
  }

  set metadataFactory(factory: MetadataFactory) {
    this._metadataFactory = factory
  }
}
