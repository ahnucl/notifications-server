import { Context } from '@/domain/value-objects/context'
import { UseCaseResponse } from '@/types/user-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserAndContextNotificationUseCaseRequest {
  recipientId: string
  context: Context
}

type FetchUserAndContextNotificationUseCaseResponse = UseCaseResponse<
  {
    recipientId: string
    unreadAmount: number
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserAndContextNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    recipientId,
  }: FetchUserAndContextNotificationUseCaseRequest): Promise<FetchUserAndContextNotificationUseCaseResponse> {
    const unreadAmount = await this.repository.getUsersUnreadAmount(recipientId)

    return [{ recipientId, unreadAmount }, null]
  }
}
