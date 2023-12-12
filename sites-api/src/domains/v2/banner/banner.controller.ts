import { Response, ApiRequest, Get, Req, Controller, UseBefore, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { GetBanners } from './banner.service'

@Controller('/v2/banner')
@UseBefore(CustomerTenancyMiddleware)
export class BannerController {
  @Get('/')
  public async index(@Req() request: ApiRequest) {
    try {
      const banners = await GetBanners(request.tenant)

      return { banners }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
