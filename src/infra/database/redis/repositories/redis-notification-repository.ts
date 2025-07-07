/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationRepository } from '@/domain/application/repositories/notification-repository'
import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { AppRedisClient } from '../redis.service'

export class RedisNotificationRepository implements NotificationRepository {
  constructor(private client: AppRedisClient) {
    this.client.connect()
  }

  findManyByUserId(idUser: string): Promise<Notification[]> {
    throw new Error('Method not implemented.')
  }
  getUsersUnreadAmount(idUser: string): Promise<number> {
    throw new Error('Method not implemented.')
  }
  findManyUnreadByType(
    idUser: string,
    type: MetadataType
  ): Promise<Notification[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }
  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
