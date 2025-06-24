import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { NotificationRepository } from '../repositories/notification-repository'
import { CreateNotificationUseCase } from './create-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { TestMetadataFactory } from 'test/metadata/testing-metadata-factory'

let inMemoryNotificationRepository: NotificationRepository
let metadataFactory: MetadataFactory
let sut: CreateNotificationUseCase

describe('Create notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    metadataFactory = new TestMetadataFactory()

    sut = new CreateNotificationUseCase(
      inMemoryNotificationRepository,
      metadataFactory
    )
  })

  it('should be able to create a notification', async () => {
    const [newNotification] = await sut.execute({
      primaryKeyValue: 1,
      auxiliarFieldValue: 2,
      recipientId: '400400',
    })

    expect(newNotification).not.toBeNull()

    const createNotificationMetadataType = newNotification!.getType()

    expect(createNotificationMetadataType).toBe('none')
  })
})
