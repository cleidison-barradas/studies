import { IntegrationLogRepository, IntegrationLog } from '@mypharma/api-core'
import { ObjectLiteral, FindManyOptions } from 'typeorm'
import { startOfDay, endOfDay } from 'date-fns'

import { integration } from '../../../config/database'

import getIntegrationStatus from '../helpers/getIntegrationStatus'

class IntegrationGetLogs {
  constructor(private repository?: any) { }

  async getIntegrationLogs(startDate?: Date, endDate?: Date): Promise<IntegrationLog[]> {
    const where: ObjectLiteral = {}

    if (startDate && endDate) {
      where['lastSeen'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date(endDate)) }
    }

    if (startDate && !endDate) {
      where['lastSeen'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date()) }
    }

    if (!startDate && endDate) {
      where['lastSeen'] = { $gte: startOfDay(new Date('2000-01-01T00:08:52.308+00:00')), $lte: endOfDay(new Date(endDate)) }
    }

    const optionsOrConditions: FindManyOptions<IntegrationLog> = {
      where,
      order: { lastSeen: 1 },
    }


    const integrations = await IntegrationLogRepository.repo(integration).find(optionsOrConditions)

    return integrations.map(integration => {
      integration.status = getIntegrationStatus(integration.lastSeen)

      return integration
    })
  }

}

export default IntegrationGetLogs
