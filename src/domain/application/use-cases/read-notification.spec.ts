import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read a notification', async () => {
    inMemoryNotificationRepository.create(
      makeNotification({
        recipientId: '400400',
        metadata: {
          type: 'none',
          name: '',
          primaryKey: {
            name: '',
            value: 1,
          },
          auxiliarField: {
            name: '',
            value: 2,
          },
        },
      })
    )

    const [notification] = await sut.execute({
      primaryKeyValue: 1,
      auxiliarFieldValue: 2,
      recipientId: '400400',
      type: 'none',
    })

    expect(notification).not.toBeNull()
    expect(notification?.readAt).toBeTruthy()

    const readNotification = inMemoryNotificationRepository.notifications[0]
    expect(readNotification.readAt).toBeTruthy()
  })
})
