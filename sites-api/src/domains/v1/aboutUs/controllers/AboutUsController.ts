import {
  Response,
  ApiRequest,
  Get,
  Req,
  UseBefore,
  Controller,
  CustomerTenancyMiddleware,
} from '@mypharma/api-core'
import { GetAboutUs } from '../services/AboutUsService'

@Controller('/v1/about-us')
@UseBefore(CustomerTenancyMiddleware)
export class AboutUsController {
  @Get('/')
  public async index(@Req() request: ApiRequest) {
    try {
      const aboutus = await GetAboutUs(request.tenant)
      if (!aboutus) {
        return { content: '' }
      }
      const { content } = aboutus
      return { content }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
