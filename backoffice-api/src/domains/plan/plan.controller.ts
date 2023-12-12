import { Body, Delete, Get, JsonController, Param, Post, Put, Res, StorePlan } from '@mypharma/api-core'
import { Response } from 'express'
import { IPutStorePlanRequest } from './interfaces/plan.request'
import PlanService from './plan.service'

@JsonController('/v1/plan')
export default class PlanController {
  @Post()
  async createPlan(@Res() response: Response, @Body() body: IPutStorePlanRequest): Promise<StorePlan | unknown> {
    try {
      const planService = new PlanService()
      const plan = await planService.create(body)

      return { plan }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Get()
  async getPlans(@Res() response: Response): Promise<unknown> {
    try {
      const planService = new PlanService()
      const plans = await planService.getPlans()

      return { plans }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Delete('/:id')
  async softDeletePlan(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const planService = new PlanService()
      await planService.softDelete(id)
      return { deleteId: id }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Put()
  async updateStore(@Res() response: Response, @Body() body: IPutStorePlanRequest): Promise<StorePlan | unknown> {
    const { plan } = body
    try {
      const planService = new PlanService()
      await planService.updatePlan(plan)
      const newPlan = await planService.getPlanDetail(plan._id)

      return response.status(201).json({ plan: newPlan })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
