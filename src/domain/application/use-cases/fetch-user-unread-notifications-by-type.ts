import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

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
    private metadataFactory: MetadataFactory
  ) {}

  async execute({
    recipientId,
  }: FetchUserUnreadNotificationsByTypeUseCaseRequest): Promise<FetchUserUnreadNotificationsByTypeUseCaseResponse> {
    const metadataType = this.metadataFactory.type
    const unreadNotifications = await this.repository.findManyUnreadByType(
      recipientId,
      metadataType
    )

    return [{ unreadNotifications, type: metadataType }, null]
  }
}
