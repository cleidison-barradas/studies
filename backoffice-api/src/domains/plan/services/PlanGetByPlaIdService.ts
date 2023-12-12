/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorePlan, StorePlanRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

interface PlanGetByPlanIdServiceDTO {
  planId?: string
}

class PlanGetByPlanIdService {
  constructor(private repository?: any) { }

  public async getPlanByPlanId({ planId }: PlanGetByPlanIdServiceDTO) {

    if (!planId) return null

    let plan = new StorePlan()

    plan = await StorePlanRepository.repo().findById(new ObjectId(planId))

    if (!plan) {

      throw new Error('plan_not_found')
    }

    return plan
  }
}

export default PlanGetByPlanIdService