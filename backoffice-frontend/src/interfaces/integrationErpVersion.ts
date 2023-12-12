import Erp from './erp'
import IntegrationSql from './integrationSql'

export default interface IntegrationErpVersion {
    _id: string
    name: string
    erpId: Erp['_id']
    originalId?: number
    sql: IntegrationSql[]
}
