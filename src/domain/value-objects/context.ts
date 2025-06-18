// import { Resource } from '@/value-objects/resource'

import { Resource } from './resource'

/**
 * monitoracao.tb_monitoracao_item
 * cd_monitoracao_item
 * js_observacao
 * observacaoIndex
 */

interface ContextProps {
  resource: Resource
}

export class Context {
  private resource: Resource

  constructor(props: ContextProps) {
    this.resource = props.resource
  }

  public getResourceName() {
    return this.resource.name
  }
}
