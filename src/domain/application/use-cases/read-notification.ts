import { Notification } from '@/domain/entities/notification'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = UseCaseResponse<Notification, Error>

export class ReadNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.repository.findById(notificationId)

    if (!notification) {
      return [null, new Error('Resouce not found')]
    }

    if (notification.recipientId !== recipientId) {
      return [null, new Error('Not allowed')]
    }

    notification.read()

    await this.repository.save(notification)

    return [notification, null]
  }
}
