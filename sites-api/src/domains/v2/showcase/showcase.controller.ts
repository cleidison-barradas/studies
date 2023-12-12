import { ApiRequest, Get, Req, UseBefore, CustomerTenancyMiddleware, Res, JsonController } from '@mypharma/api-core'
import { getAvailableShowcases } from './showcase.service'
import { Response } from 'express'
import { LoadStoreByID } from '../cart/cart.service'
import { ObjectId } from 'bson'

@JsonController('/v2/showcase')
@UseBefore(CustomerTenancyMiddleware)
class ShowcaseController {
  @Get()
  public async getShowcase(@Req() request: ApiRequest, @Res() response: Response) {
    try {
      const store = await LoadStoreByID(new ObjectId(request.session.store) as any)
      const showcases = await getAvailableShowcases(request.tenant, store)

      return response.json({
        showcases
      })

    } catch (error) {
      console.log(error)

      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}

export { ShowcaseController }
