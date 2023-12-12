import { Response, Get, Req, ApiRequest, JsonController, UseBefore, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { getBranchPickupService } from './branchPickup.service'

@JsonController('/v2/pickupBranch')
@UseBefore(CustomerTenancyMiddleware)
export class PickupbranchController {
  @Get('/')
  public async create(@Req() request: ApiRequest) {
    try {
      const { tenant } = request

      const branchesPickup = await getBranchPickupService(tenant)

      return { branchesPickup }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
