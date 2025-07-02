import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserUnreadNotificationAmountUseCaseRequest {
  recipientId: string
}

type FetchUserUnreadNotificationAmountUseCaseResponse = UseCaseResponse<
  {
    unreadAmount: number
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserUnreadNotificationAmountUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    recipientId,
  }: FetchUserUnreadNotificationAmountUseCaseRequest): Promise<FetchUserUnreadNotificationAmountUseCaseResponse> {
    const unreadAmount = await this.repository.getUsersUnreadAmount(recipientId)

    return [{ unreadAmount }, null]
  }
}
