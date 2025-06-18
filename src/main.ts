import { MonitoringItem } from './value-objects/resources/monitoring-item'
import { Context } from './value-objects/context'

console.log('Building...')

console.log(MonitoringItem.name)

const monitoringItemsContext = new Context({ resource: MonitoringItem })

console.log(monitoringItemsContext)
