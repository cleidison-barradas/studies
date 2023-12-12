import { BaseRepository } from '../../../support/repositories/BaseRepository'
import { StoreData } from '../../../support/interfaces/StoreData'
import { Store } from '../models/base/Store'

export class StoreRepository<T extends Store> extends BaseRepository<T> {
  public async getById(id: number) {
    try {
      return await this.repository.findOne({
        where: {
          storeId: id
        }
      })
    } catch {
      return null
    }
  }

  public async create(store: StoreData): Promise<Store> {
    return await this.repository.save(store as any)
  }
}
export const storeRepository = new StoreRepository<Store>(Store)

