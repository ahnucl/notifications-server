import { randomUUID } from 'node:crypto'

export class EntityID {
  readonly value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(id: EntityID) {
    return this.value === id.value
  }
}
