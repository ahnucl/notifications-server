import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { TestMetadataFactory } from 'test/metadata/testing-metadata-factory'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { FetchUserUnreadNotificationsByTypeUseCase } from './fetch-user-unread-notifications-by-type'
import { makeNotification } from 'test/factories/make-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let metadataFactory: MetadataFactory
let sut: FetchUserUnreadNotificationsByTypeUseCase

describe("Fetch user's notification by metadata type", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    metadataFactory = new TestMetadataFactory()

    sut = new FetchUserUnreadNotificationsByTypeUseCase(
      inMemoryNotificationRepository,
      metadataFactory
    )
  })

  it("should returns user's total unread notifications", async () => {
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
          type: 'none',
          name: '',
          primaryKey: { name: '', value: '' },
        },
        recipientId: '400400',
        readAt: new Date(),
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

    const { unreadNotifications, type } = usersNotification!

    expect(type).toBe('none')
    expect(unreadNotifications).toHaveLength(1)
    expect(unreadNotifications[0].type).toEqual('none')
    expect(unreadNotifications[0].recipientId).toBe('400400')
    expect(inMemoryNotificationRepository.notifications).toHaveLength(3)
  })
})
