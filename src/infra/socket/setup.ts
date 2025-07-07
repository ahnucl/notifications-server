import { setupControllers } from '../app/setup-controllers'
import { setupServices } from '../app/setup-services'
import { setupUseCases } from '../app/setup-use-cases'
import { SocketEmitter } from './emitter'

const services = setupServices()

const useCases = setupUseCases(services)

export function makeControllers(emitter: SocketEmitter) {
  return setupControllers(useCases, emitter)
}
