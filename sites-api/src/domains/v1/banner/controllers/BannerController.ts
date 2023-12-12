import {
  Response,
  ApiRequest,
  Get,
  Req,
  Controller,
  Banner,
  UseBefore,
  CustomerTenancyMiddleware,
} from '@mypharma/api-core'
import { GetBanners } from '../services/BannerService'

@Controller('/v1/banner')
@UseBefore(CustomerTenancyMiddleware)
export class BannerController {
  @Get('/')
  public async index(@Req() request: ApiRequest) {
    try {
      const result = await GetBanners(request.tenant)

      const banners = result.map((value: Banner) => {
        return {
          title: value.image.name,
          link: '',
          image: value.image.key,
        }
      })

      return { banners }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
