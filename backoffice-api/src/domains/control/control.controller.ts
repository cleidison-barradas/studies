import { AuthHandlerMiddleware, Get, JsonController, Params, QueryParams, Res, UseBefore } from '@mypharma/api-core'
import { String } from 'aws-sdk/clients/batch'
import { Response } from 'express'
import { IQueryParams } from '../../interfaces/queryParams'
import ControlService from './control.service'

@JsonController('/v1/control')
@UseBefore(AuthHandlerMiddleware)
export default class ControlController {
  @Get()
  async index(
    @QueryParams() queryParams: IQueryParams,
    @Res() response: Response
  ) {
    try {
      const { data, page, limit, totalPages } = await ControlService.getProductControl(queryParams)

      return response.json({
        controls: data,
        page,
        limit,
        totalPages,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }
}
