import { Response, ApiRequest, Get, Req, UseBefore, CustomerTenancyMiddleware, Res, JsonController } from '@mypharma/api-core'
import { Response as IResponse } from 'express'

@JsonController('/health')
export class HealthCheck {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: IResponse) {
    return response.status(200).json({'message' : 'ok'})
  }
}