import { Store, StoreRepository } from '@mypharma/api-core'


const getAllStores = async(): Promise<any> => {
  const stores = await StoreRepository.repo().find({
    select: [ 'tenant' ]
  })
  return stores
}

export default getAllStores
