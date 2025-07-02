import {
  MetadataFactory,
  MetadataValues,
} from '@/domain/value-objects/metadata/metadata-factory'
import { MetadataType } from '@/domain/value-objects/metadata/metadata-types'
import { Metadata } from '@/domain/value-objects/metadata/notificataion-metadata'

export class MonitoringItemCommentMetadataFactory extends MetadataFactory {
  readonly type: MetadataType = 'monitoringItemComment'

  produce({ primaryKeyValue, auxiliarFieldValue }: MetadataValues): Metadata {
    if (auxiliarFieldValue !== 0 && !auxiliarFieldValue)
      throw new Error('Auxiliar value is required for monitoringItemComment')

    return {
      type: this.type,
      name: 'tb_monitoracao_item',
      primaryKey: {
        name: 'cd_monitoracao_item',
        value: primaryKeyValue,
      },
      auxiliarField: {
        name: 'js_observacao',
        value: auxiliarFieldValue,
      },
    }
  }
}
