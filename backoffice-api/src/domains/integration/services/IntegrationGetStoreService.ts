import { IntegrationLogRepository, IntegrationLog } from '@mypharma/api-core'
import moment from 'moment'
import { IntegrationStatus } from '../interfaces/integration.status'
import { integration } from '../../../config/database'

interface RequestIntegrationGetStoresService {
  page?: number
  limit?: number
  search?: string
  status?: IntegrationStatus
}

class IntegrationGetStoresService {
  constructor(private repository?: any) { }

  public async getIntegrationInfo({ page, limit, status, search }: RequestIntegrationGetStoresService): Promise<{ integrations: IntegrationLog[], total: number }> {
    const MS_DAY = 60000 * 1440
    let where: Record<string, any> = undefined

    if (search) {
      where = {
        $or: [
          { storeName: new RegExp(search, 'i') },
          { storeUrl: new RegExp(search, 'i') }
        ]
      }
    }

    let [integrations, total] = await IntegrationLogRepository.repo(integration).findAndCount({
      where,
      take: status ? undefined : Number(limit),
      order: { lastSeen: 1 },
      skip: status ? undefined : Number(limit) * (Number(page) - 1),
    })

    integrations = integrations.map(_integration => {
      let currentStatus: IntegrationStatus = 'healthy'

      if (moment().diff(moment(_integration.lastSeen)) > MS_DAY && moment().diff(moment(_integration.lastSeen)) <= MS_DAY * 6) {
        currentStatus = 'warning'
      }

      if (moment().diff(moment(_integration.lastSeen)) > MS_DAY * 6) {
        currentStatus = 'problem'
      }
      if (!_integration.lastSeen) {
        currentStatus = 'unknown'
      }

      _integration.status = currentStatus

      return _integration
    })

    if (status) {
      integrations = integrations.filter(x => x.status.toString().includes(status.toString()))
      total = integrations.length
    }

    return {
      integrations,
      total
    }
  }
}

export default IntegrationGetStoresService