import { Notification } from '@/domain/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { Context } from '@/domain/value-objects/context'
import { UseCaseResponse } from '@/types/user-case-response'

interface CreateNotificationUseCaseRequest {
  recipientId: string
  context: Context
}

type CreateNotificationUseCaseResponse = UseCaseResponse<Notification, Error> // TODO: melhorar esse erro

export class CreateNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    context,
    recipientId,
  }: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
    const notification = new Notification({
      context,
      recipientId,
    })

    await this.repository.create(notification)

    return [notification, null]
  }
}
