import { IntegrationStatus } from './integration.status'

export interface IntegrationRequest {
  page?: number
  limit?: number
  search?: string
  status?: IntegrationStatus
}

export interface IntegrationsReportRequest {
  status?: string
  startDate?: Date
  endDate?: Date
}
