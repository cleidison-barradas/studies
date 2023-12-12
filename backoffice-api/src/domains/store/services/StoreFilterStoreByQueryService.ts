/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreRepository } from '@mypharma/api-core'

interface StoreFitlerStoreByQueryServiceDTO {
  page: number
  limit: number
  name?: string
  startDate?: Date
  endDate?: Date
  mainStore?: boolean
}

class StoreFitlerStoreByQueryService {
  constructor(private repository?: any) { }

  public async getStoreByFilterQuery({ page, limit, name, startDate, endDate, mainStore }: StoreFitlerStoreByQueryServiceDTO) {
    const where: Record<any, any> = {}

    if (mainStore) {
      where['mainStore'] = Boolean(mainStore)
    }

    if (name) {
      where['$or'] = [
        { name: new RegExp(name, 'gi') },
        { url: new RegExp(name, 'gi') }
      ]
    }

    if (startDate && endDate) {
      where['createdAt'] = { $gt: new Date(startDate), $lte: new Date(endDate) }
    }

    const [stores = [], total] = await StoreRepository.repo().findAndCount({
      where,
      take: Number(limit),
      skip: Number(limit) * (Number(page) - 1)
    })

    return { stores, total }
  }
}

export default StoreFitlerStoreByQueryService
