import { AuthHandlerMiddleware, Get, JsonController, Params, QueryParams, Res, UseBefore } from '@mypharma/api-core'
import { String } from 'aws-sdk/clients/batch'
import { Response } from 'express'
import ClassificationService from './classification.service'

@JsonController('/v1/classification')
@UseBefore(AuthHandlerMiddleware)
export default class ControlController {
  @Get()
  async index(
    @QueryParams() { page = 1, limit = 20, query = null }: { page: number; limit: number; query: string },
    @Res() response: Response
  ) {
    try {
      page = Number(page)
      limit = Number(limit)

      const classifications = await ClassificationService.getProductClassification(page, limit, query)

      return response.json({
        classifications,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }
}
