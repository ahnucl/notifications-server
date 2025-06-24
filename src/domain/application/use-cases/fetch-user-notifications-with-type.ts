import { Notification } from '@/domain/entities/notification'
import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { UseCaseResponse } from '@/types/user-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserNotificationsWithTypeUseCaseRequest {
  recipientId: string
}

type FetchUserNotificationsWithTypeUseCaseResponse = UseCaseResponse<
  {
    unreadAmount: number
    unreadNotificationsOfType: Notification[]
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserNotificationsWithTypeUseCase {
  constructor(
    private repository: NotificationRepository,
    private metadataFactory: MetadataFactory
  ) {}

  async execute({
    recipientId,
  }: FetchUserNotificationsWithTypeUseCaseRequest): Promise<FetchUserNotificationsWithTypeUseCaseResponse> {
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
