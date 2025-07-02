/**
 * THIS IS A SKETCH
 */

import { SocketEmitter } from './create-monitoring-item-comment-notification.controller'

interface BaseControllerProps {
  path: string
  emitter: SocketEmitter
}

export abstract class Controller {
  readonly path: string
  protected emitter: SocketEmitter

  constructor({ path, emitter }: BaseControllerProps) {
    this.path = path
    this.emitter = emitter
  }

  public abstract handle(data: unknown): Promise<void>
}
