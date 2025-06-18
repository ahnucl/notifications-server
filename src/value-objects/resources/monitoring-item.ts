import { Resource } from '../resource'

export const MonitoringItem: Resource = {
  name: 'tb_monitoracao_item',
  primaryKey: 'cd_monitoracao_item',
  detailedField: {
    name: 'js_observacao',
    key: 'index',
  },
}
