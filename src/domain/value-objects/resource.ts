export interface Resource {
  name: string
  primaryKey: string
  detailedField: {
    name: string
    key: 'index'
  } | null
}
