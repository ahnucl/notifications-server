import { Notification } from '@/domain/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { Context } from '@/domain/value-objects/context'
import { UseCaseResponse } from '@/types/user-case-response'

interface FetchUserNotificationsUseCaseRequest {
  recipientId: string
  context: Context
}

// TODO: Verificar se um caso de uso para buscar todos os contadores resolve melhor
interface teste {
  usersNotifications: number
  context: {}
}

type FetchUserNotificationsUseCaseResponse = UseCaseResponse<
  Notification[],
  Error
> // TODO: melhorar esse erro

export class FetchUserNotificationsUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute({
    context,
    recipientId,
  }: FetchUserNotificationsUseCaseRequest): Promise<FetchUserNotificationsUseCaseResponse> {
    const notifications = await this.repository.findManyByUserId(recipientId)

    return [notifications, null]
  }
}
