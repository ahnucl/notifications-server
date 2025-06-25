import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { TestMetadataFactory } from 'test/metadata/testing-metadata-factory'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { FetchUserNotificationsWithTypeUseCase } from './fetch-user-notifications-with-type'
import { makeNotification } from 'test/factories/make-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let metadataFactory: MetadataFactory
let sut: FetchUserNotificationsWithTypeUseCase

describe("Fetch user's notification by metadata type", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    metadataFactory = new TestMetadataFactory()

    sut = new FetchUserNotificationsWithTypeUseCase(
      inMemoryNotificationRepository,
      metadataFactory
    )
  })

  it("should returns user's total unred notifications", async () => {
    inMemoryNotificationRepository.create(
      makeNotification({
        metadata: {
          type: 'none',
          name: '',
          primaryKey: { name: '', value: '' },
        },
        recipientId: '400400',
      })
    )
    inMemoryNotificationRepository.create(
      makeNotification({
        metadata: {
          type: 'monitoringItemComment',
          name: '',
          primaryKey: { name: '', value: '' },
        },
        recipientId: '400400',
      })
    )

    const [usersNotification] = await sut.execute({
      recipientId: '400400',
    })

    const { unreadAmount, unreadNotificationsOfType } = usersNotification!

    expect(unreadAmount).toBe(2)
    expect(unreadNotificationsOfType).toHaveLength(1)
    expect(unreadNotificationsOfType[0].getType()).toEqual(metadataFactory.type)
  })
})
