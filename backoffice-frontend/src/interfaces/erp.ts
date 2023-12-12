import IntegrationErpVersion from './integrationErpVersion'

export default interface Erp {
    _id: string
    name: string
    originalId?: number
    versions: IntegrationErpVersion[]
    updatedAt: Date
    createdAt: Date
}
