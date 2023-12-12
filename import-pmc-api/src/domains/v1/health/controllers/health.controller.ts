import { ApiRequest, Get, Req, Res, JsonController } from '@mypharma/api-core'
import { Response as IResponse } from 'express'

@JsonController('/health')
export class HealthCheck {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: IResponse) {
    const helthcheck = {
      message: 'OK',
      timestamp: Date.now(),
      uptime: process.uptime(),
      responsetime: process.hrtime(),
    }

    try {

      return response.send(helthcheck)

    } catch (error) {
      console.log(error)
      helthcheck.message = error.message

      return response.status(500).send(helthcheck)
    }
  }
}
