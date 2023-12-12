import { IQueueDataInvalidate } from "../../../support/helpers/WorkerQueue";

export const groupData = (data: IQueueDataInvalidate[]) => {
  if (data.length <= 0) return null
  const eans: string[] = []
  const tenants: string[] = []

  const eanData = new Set(data.map(e => e.ean.toString()))
  const tenantData = new Set(data.map(t => t.tenant.toString()))

  eanData.forEach(e => eans.push(e))
  tenantData.forEach(t => tenants.push(t))


  return {
    eans,
    tenants
  }
}