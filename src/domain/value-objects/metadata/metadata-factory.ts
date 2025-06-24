import { MetadataType } from './metadata-types'
import { Metadata } from './notificataion-metadata'

export interface MetadataValues {
  primaryKeyValue: string | number
  auxiliarFieldValue?: string | number
}

export abstract class MetadataFactory {
  abstract readonly type: MetadataType
  abstract produce(values: MetadataValues): Metadata
}
