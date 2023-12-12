/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAffiliateStore, ObjectID, StoreRepository } from '@mypharma/api-core'

interface StoreGetAffiliateStoreServiceDTO {
  affiliateStores: any[]
}

class StoreGetAffiliateStoreService {
  constructor(private repository?: any) { }

  public async getAffiliateStores({ affiliateStores = [] }: StoreGetAffiliateStoreServiceDTO) {
    const data: IAffiliateStore[] = []

    const stores = await StoreRepository.repo().find({
      where: {
        _id: { $in: affiliateStores.map(store => new ObjectID(store._id)) }
      }
    })

    stores.forEach(store => {

      data.push({
        _id: store._id as any,
        action: ['CREATE', 'UPDATE', 'DELETE'],
        entity: ['BANNERS', 'CUPOM', 'ABOUTUS', 'PROMOTION', 'PRODUCT', 'SHOWCASE']
      })
    })

    return data
  }
}

export default StoreGetAffiliateStoreService
