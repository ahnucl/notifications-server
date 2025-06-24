import {
  MetadataFactory,
  MetadataValues,
} from '@/domain/value-objects/metadata/metadata-factory'
import { Metadata } from '@/domain/value-objects/metadata/notificataion-metadata'

export class TestMetadataFactory extends MetadataFactory {
  readonly type = 'none'

  produce({ primaryKeyValue, auxiliarFieldValue }: MetadataValues): Metadata {
    const metadata: Metadata = {
      type: this.type,
      name: 'main_resource_name',
      primaryKey: {
        name: 'main_resource_id',
        value: primaryKeyValue,
      },
    }

    if (auxiliarFieldValue) {
      metadata.auxiliarField = {
        name: 'auxiliar_resource_name',
        value: auxiliarFieldValue,
      }
    }

    return metadata
  }
}
