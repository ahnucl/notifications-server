import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserNotificationAmountUseCaseRequest {
  recipientId: string
}

type FetchUserNotificationAmountUseCaseResponse = UseCaseResponse<
  {
    unreadAmount: number
  },
  Error
> // TODO: melhorar esse erro

export class FetchUserNotificationAmountUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    recipientId,
  }: FetchUserNotificationAmountUseCaseRequest): Promise<FetchUserNotificationAmountUseCaseResponse> {
    const notifications = await this.repository.findManyByUserId(recipientId)

    return [{ unreadAmount: notifications.length }, null]
  }
}
