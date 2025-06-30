import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { FetchUserNotificationAmountUseCase } from './fetch-user-notification-amount'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: FetchUserNotificationAmountUseCase

describe("Fetch user's notifications", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sut = new FetchUserNotificationAmountUseCase(inMemoryNotificationRepository)
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

    expect(unreadAmount).toBe(2)
    expect(inMemoryNotificationRepository.notifications).toHaveLength(3)
  })
})
