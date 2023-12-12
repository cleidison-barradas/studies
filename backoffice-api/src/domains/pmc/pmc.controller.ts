import { Get, JsonController, QueryParams, Res } from '@mypharma/api-core'
import { Response } from 'express'
import { IGetErpRequest } from '../erp/interfaces/erp.request'
import PmcService from './pmc.service'

@JsonController('/v1/pmc')
export default class PmcController {
  @Get()
  async getPmcs(@Res() response: Response, @QueryParams() params: IGetErpRequest): Promise<unknown> {
    try {
      const pmcService = new PmcService()
      const pmcs = await pmcService.getPmcs(params)

      return { pmcs }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
