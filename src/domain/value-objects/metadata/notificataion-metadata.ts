import { MetadataType } from './metadata-types'

export interface Metadata {
  type: MetadataType
  name: string
  primaryKey: {
    name: string
    value: string | number
  }
  auxiliarField?: {
    name: string
    value: string | number
  }
}
