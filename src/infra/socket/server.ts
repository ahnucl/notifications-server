import { Controller } from './controller'

export abstract class SocketServer {
  abstract setup(controllers: Controller[]): void
}
