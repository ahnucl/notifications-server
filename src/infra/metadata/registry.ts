import { MetadataFactory } from '@/domain/value-objects/metadata/metadata-factory'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { MonitoringItemCommentMetadataFactory } from './monitoring-item-comment-metadata-factory'

export class MetadataFactoryRegistry {
  constructor(private registry: Record<MetadataType, MetadataFactory | null>) {}

  get(type: MetadataType) {
    return this.registry[type]
  }

  static default() {
    return new MetadataFactoryRegistry({
      monitoringItemComment: new MonitoringItemCommentMetadataFactory(),
      none: null,
    })
  }
}
