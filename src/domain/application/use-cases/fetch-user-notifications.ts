import { Notification } from '@/domain/entities/notification'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface FetchUserNotificationsUseCaseRequest {
  recipientId: string
}

type FetchUserNotificationsUseCaseResponse = UseCaseResponse<
  Notification[],
  Error
> // TODO: melhorar esse erro

export class FetchUserNotificationsUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    recipientId,
  }: FetchUserNotificationsUseCaseRequest): Promise<FetchUserNotificationsUseCaseResponse> {
    const notifications = await this.repository.findManyByUserId(recipientId)

    return [notifications, null]
  }
}
