import { Response, ApiRequest, Get, Req, UseBefore, CustomerTenancyMiddleware, Res, JsonController } from '@mypharma/api-core'
import { GetAboutUs } from './aboutus.service'
import { Response as IResponse } from 'express'

@JsonController('/v2/about-us')
@UseBefore(CustomerTenancyMiddleware)
export class AboutUsController {
  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: IResponse) {
    try {
      const aboutus = await GetAboutUs(request.tenant)

      if (!aboutus) {
        throw new Error('aboutus_not_found')
      }

      return { content: aboutus.content }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ content: 'error' })
    }
  }
}
