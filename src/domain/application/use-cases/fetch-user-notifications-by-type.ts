import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

interface FetchUserNotificationsByTypeUseCaseRequest {
  recipientId: string
}

type FetchUserNotificationsByTypeUseCaseResponse = UseCaseResponse<
  {
    unreadNotifications: Notification[]
    type: MetadataType
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserNotificationsByTypeUseCase {
  constructor(
    private repository: NotificationRepository,
    private metadataFactory: MetadataFactory
  ) {}

  async execute({
    recipientId,
  }: FetchUserNotificationsByTypeUseCaseRequest): Promise<FetchUserNotificationsByTypeUseCaseResponse> {
    const metadataType = this.metadataFactory.type
    const unreadNotifications =
      await this.repository.getUsersUnreadAmountByType(
        recipientId,
        metadataType
      )

    return [{ unreadNotifications, type: metadataType }, null]
  }
}
