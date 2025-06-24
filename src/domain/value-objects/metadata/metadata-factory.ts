import { Metadata } from './notificataion-metadata'

export interface MetadataValues {
  primaryKeyValue: string | number
  auxiliarFieldValue?: string | number
}

export abstract class MetadataFactory {
  abstract produce(values: MetadataValues): Metadata
}
