import { StoreRepository, ObjectID } from '@mypharma/api-core'

export class StoreService {
  private VALID_SETTINGS = [
    'config_name',
    'config_store_city',
    'config_logo'
  ]

  public async getStore(storeId: string | number) {
    const store = await StoreRepository.repo<StoreRepository>().findOne({
      select: ['name', 'url', 'settings'],
      where: {
        ...ObjectID.isValid(storeId) ? { _id: new ObjectID(storeId) } : { originalId: Number(storeId) }
      }
    })

    // Parse store
    if (store) {
      Object.keys(store.settings).forEach(key => {
        if (!this.VALID_SETTINGS.includes(key)) {
          delete store.settings[key]
        }
      })
    }

    return store
  }
}