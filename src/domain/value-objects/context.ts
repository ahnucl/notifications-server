import { Resource } from './resource'

interface ContextProps {
  resource: Resource
}

export class Context {
  private resource: Resource

  constructor({ resource }: ContextProps) {
    this.resource = resource
  }

  public getResourceName() {
    return this.resource.name
  }
}
