/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectID, StoreRepository } from '@mypharma/api-core'

interface StoreValidateUrlServiceDTO {
  url: string
  storeId?: string
}

class StoreValidateUrlService {
  constructor(private repository?: any) { }

  public async validateStoreUrl({ url, storeId }: StoreValidateUrlServiceDTO) {
    const where: Record<string, any> = {}

    try {

      url = new URL(url).href

      where['url'] = url

      if (storeId) {

        where['_id'] = { $ne: new ObjectID(storeId) }
      }

      const count = await StoreRepository.repo().count(where)

      return {
        url,
        count
      }

    } catch (error) {
      console.log(error)
      throw new Error('invalid_store_url')
    }
  }
}

export default StoreValidateUrlService