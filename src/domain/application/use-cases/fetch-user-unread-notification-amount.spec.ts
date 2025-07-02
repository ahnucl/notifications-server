import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { FetchUserUnreadNotificationAmountUseCase } from './fetch-user-unread-notification-amount'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: FetchUserUnreadNotificationAmountUseCase

describe("Fetch user's notifications", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sut = new FetchUserUnreadNotificationAmountUseCase(
      inMemoryNotificationRepository
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
          type: 'monitoringItemComment',
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
          type: 'none',
          name: '',
          primaryKey: { name: '', value: '' },
        },
        recipientId: '500500',
      })
    )

    const [usersNotification] = await sut.execute({
      recipientId: '400400',
    })

    const { unreadAmount } = usersNotification!

    expect(unreadAmount).toBe(1)
    expect(inMemoryNotificationRepository.notifications).toHaveLength(3)
  })
})
