type TypeStatus = 'healthy' | 'warning' | 'problem' | 'unknown'

export default interface IntegrationStatus {
  _id: number
  statusName: TypeStatus
}
