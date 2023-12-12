import Erp from "./erp"
import IntegrationSql from "./integrationSql"
import Store from "./store"

export default interface StoreIntegration {
  store: Store,
  integration: IntegrationSql,
  fields: string[],
  onlyFractioned: boolean,
  erp: Erp,
  updatedAt: Date,
  createdAt: Date
}