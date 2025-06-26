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
    const notification = makeNotification({
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
    inMemoryNotificationRepository.create(notification)

    const [response] = await sut.execute({
      notificationId: notification.id.value,
      recipientId: '400400',
    })

    expect(response).not.toBeNull()
    expect(response?.readAt).toBeTruthy()

    const readNotification = inMemoryNotificationRepository.notifications[0]
    expect(readNotification.readAt).toBeTruthy()
  })

  it('should return an error if notification was not found', async () => {})
})
