import { Store, StorePlan, StorePlanRepository, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { DeleteWriteOpResultObject, UpdateWriteOpResult } from 'typeorm'
import { IPutStorePlanRequest } from './interfaces/plan.request'
const { DATABASE_MASTER_NAME } = process.env

export default class PlanService {
  async create({ plan }: IPutStorePlanRequest): Promise<StorePlan> {
    return StorePlanRepository.repo(DATABASE_MASTER_NAME).createDoc(plan)
  }

  async getPlans(): Promise<StorePlan[]> {
    return StorePlanRepository.repo(DATABASE_MASTER_NAME).find()
  }

  async getPlanDetail(_id: string | StorePlan['_id']): Promise<StorePlan> {
    const id = new ObjectId(_id.toString())

    return StorePlanRepository.repo(DATABASE_MASTER_NAME).findById(id)
  }

  async softDelete(_id: string): Promise<DeleteWriteOpResultObject> {
    return StorePlanRepository.repo(DATABASE_MASTER_NAME).deleteOne({ _id: new ObjectId(_id) })
  }

  async updatePlan(storePlan: StorePlan): Promise<UpdateWriteOpResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _id = new ObjectId(storePlan._id.toString())
    delete storePlan._id
    return StorePlanRepository.repo(DATABASE_MASTER_NAME).updateOne({ _id }, { $set: storePlan })
  }

  async setPlanToStore(storePlan: StorePlan | null, store: Store): Promise<void> {

    if (storePlan) {
      const id = new ObjectId(storePlan._id.toString())
      const plan = await StorePlanRepository.repo(DATABASE_MASTER_NAME).findById(id)
  
      if (!plan) {
        throw Error('plan_not_found')
      }
    
      await StoreRepository.repo(DATABASE_MASTER_NAME).updateOne(
        { url: store.url },
        { $set: { plan: { ...plan, _id: new ObjectId(plan._id.toString()) } } }
      )
    }
  }
}
