import { MonitoringItem } from './resources/monitoring-item'
import { Context } from '../domain/value-objects/context'

console.log('Building...')

console.log(MonitoringItem.name)

const monitoringItemsContext = new Context({ resource: MonitoringItem })

console.log(monitoringItemsContext)
