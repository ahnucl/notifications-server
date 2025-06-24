import { Notification } from '@/domain/entities/notification'

import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { UseCaseResponse } from '@/types/user-case-response'
import { NotificationRepository } from '../repositories/notification-repository'

interface CreateNotificationUseCaseRequest {
  primaryKeyValue: string | number
  auxiliarFieldValue?: string | number
  recipientId: string
}

type CreateNotificationUseCaseResponse = UseCaseResponse<Notification, Error> // TODO: melhorar esse erro

export class CreateNotificationUseCase {
  constructor(
    private repository: NotificationRepository,
    private metadataFactory: MetadataFactory
  ) {}

  async execute({
    primaryKeyValue,
    auxiliarFieldValue,
    recipientId,
  }: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
    const metadata = this.metadataFactory.produce({
      primaryKeyValue,
      auxiliarFieldValue,
    })

    const notification = new Notification({
      recipientId,
      metadata,
    })

    await this.repository.create(notification)

    return [notification, null]
  }
}
