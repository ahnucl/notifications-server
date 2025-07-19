import { makeClient } from '../database/redis/redis.service'
import { RedisNotificationRepository } from '../database/redis/repositories/redis-notification-repository'
import { MonitoringItemCommentMetadataFactory } from '../metadata/monitoring-item-comment-metadata-factory'
import { MetadataFactoryRegistry } from '../metadata/registry'
import { AppServices } from './interfaces'

export function setupServices(): AppServices {
  const repository = new RedisNotificationRepository(makeClient())
  const monitoringItemCommentMetadataFactory =
    new MonitoringItemCommentMetadataFactory()
  const metadataRegistry = MetadataFactoryRegistry.default()

  return {
    repository,
    monitoringItemCommentMetadataFactory,
    metadataRegistry,
  }
}
