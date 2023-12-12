/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericObject, ObjectID, Pmc, StorePlan, StoreRepository } from '@mypharma/api-core'

interface StoreUpdateServiceDTO {
  pmc?: Pmc
  url: string
  name: string
  storeId: string
  plan: StorePlan
  mainStore: boolean
  settings: GenericObject
}

class StoreUpdateService {
  constructor(private repository?: any) { }

  public async updateStore({ storeId, ...data }: StoreUpdateServiceDTO) {
    const _id = new ObjectID(storeId)

    if (data.plan) {

      data.plan._id = new ObjectID(data.plan._id)
    }
    if (data.pmc) {

      data.pmc._id = new ObjectID(data.pmc._id)
    }

    await StoreRepository.repo().updateOne(
      { _id },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      })

    return StoreRepository.repo().findById(new ObjectID(storeId))
  }
}

export default StoreUpdateService