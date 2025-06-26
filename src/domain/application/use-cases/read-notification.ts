import { Notification } from '@/domain/entities/notification'
import { UseCaseResponse } from '@/types/use-case-response'
import { NotificationRepository } from '../repositories/notification-repository'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'

interface ReadNotificationUseCaseRequest {
  primaryKeyValue: string | number
  auxiliarFieldValue?: string | number
  recipientId: string
  type: MetadataType
}

type ReadNotificationUseCaseResponse = UseCaseResponse<Notification, Error>

export class ReadNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    primaryKeyValue,
    auxiliarFieldValue,
    recipientId,
    type,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.repository.findByUserAndMetadata(
      recipientId,
      {
        primaryKeyValue,
        auxiliarFieldValue,
        type,
      }
    )

    if (!notification) {
      return [null, new Error('Resouce not found')]
    }

    notification.read()

    await this.repository.save(notification)

    return [notification, null]
  }
}
