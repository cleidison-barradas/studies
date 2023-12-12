export interface IntegrationOrderSupport {
  email: string
  token: string
}

export interface IntegrationErp {
  _id: string
  name: string
  hasOrderSupport: boolean
  orderSupport?: IntegrationOrderSupport
}

export interface IntegrationErpVersion {
  _id: string
  name: string
}

export interface Integration {
  erp: IntegrationErp | null
  erpVersion: IntegrationErpVersion
  lastSeen: string | null
  mergeableFields: string[]
  status: 'healthy' | 'warning' | 'problem' | 'unknown'
}
