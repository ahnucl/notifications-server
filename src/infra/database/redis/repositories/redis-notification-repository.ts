/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationRepository } from '@/domain/application/repositories/notification-repository'
import { Notification } from '@/domain/entities/notification'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import type { RedisClientType, SearchReply } from 'redis'
import {
  RedisNotification,
  RedisNotificationMapper,
} from '../mappers/redis-notification-mapper'

export class RedisNotificationRepository implements NotificationRepository {
  constructor(private client: RedisClientType) {
    this.client.connect()
  }

  async create(notification: Notification): Promise<void> {
    const key = `notification:${notification.id.value}`
    const redisNotification = RedisNotificationMapper.toRedis(notification)
    await this.client.json.set(key, '$', redisNotification)
  }

  findManyByUserId(idUser: string): Promise<Notification[]> {
    throw new Error('Method not implemented.')
  }

  async getUsersUnreadAmount(idUser: string): Promise<number> {
    const raw = (await this.client.ft.search(
      'idx:notifications',
      `${idUser} @readAt:"_null"`
    )) as SearchReply | null

    if (!raw) {
      return 0
    }

    return raw.total
  }

  async findManyUnreadByType(
    idUser: string,
    type: MetadataType
  ): Promise<Notification[]> {
    const raw = (await this.client.ft.search(
      'idx:notifications',
      `${idUser} @type:"${type}" @readAt:"_null"`
    )) as SearchReply | null

    if (!raw) {
      return []
    }

    const notificataions = raw.documents.map(({ value }) =>
      RedisNotificationMapper.toDomain(value as RedisNotification)
    )

    return notificataions
  }

  async findById(id: string): Promise<Notification | null> {
    const raw = (await this.client.json.get(
      `notification:${id}`
    )) as RedisNotification | null

    if (!raw) {
      return null
    }

    return RedisNotificationMapper.toDomain(raw)
  }

  async save(notification: Notification): Promise<void> {
    const key = `notification:${notification.id.value}`
    const redisNotification = RedisNotificationMapper.toRedis(notification)
    await this.client.json.set(key, '$', redisNotification)
  }
}
