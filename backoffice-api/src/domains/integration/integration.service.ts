import { IntegrationLogRepository } from '@mypharma/api-core'

export default class IntegrationService {

  async GetIntegrations(tenant: string, search?: string, page?: number, limit?: number) {
    let where: Record<any, any> = undefined
    
    if (search) {
      where = {
        $or: [
          { storeName: new RegExp(search, 'i') },
          { storeUrl: new RegExp(search, 'i') }
        ]
      }
    }

    return IntegrationLogRepository.repo(tenant).findAndCount({
      where,
      take: Number(limit),
      order: { lastSeen: 1 },
      skip: Number(limit) * (Number(page) - 1),
    })
  }
}