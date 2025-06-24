import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { UseCaseResponse } from '@/types/user-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserAndContextNotificationUseCaseRequest {
  recipientId: string
}

type FetchUserAndContextNotificationUseCaseResponse = UseCaseResponse<
  {
    unreadAmount: number
    unreadNotificationsOfType: Notification[]
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserAndContextNotificationUseCase {
  constructor(
    private repository: NotificationRepository,
    private metadataFactory: MetadataFactory
  ) {}

  async execute({
    recipientId,
  }: FetchUserAndContextNotificationUseCaseRequest): Promise<FetchUserAndContextNotificationUseCaseResponse> {
    const metadataType = this.metadataFactory.type
    const unreadAmount = await this.repository.getUsersUnreadAmount(recipientId)
    const unreadNotificationsOfType =
      await this.repository.findManyUnreadByUserAndType(
        recipientId,
        metadataType
      )

    return [{ unreadAmount, unreadNotificationsOfType }, null]
  }
}
