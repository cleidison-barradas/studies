import { Res, Get, Req, UseBefore, ApiRequest, JsonController, Param, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { Response } from 'express'
import { getPaymentLinkByFingerprint } from './link.service'

@JsonController('/v2/link')
@UseBefore(CustomerTenancyMiddleware)
export class PaymentLinkController {
  @Get('/:fingerprint')
  public async index(@Req() request: ApiRequest, @Param('fingerprint') fingerprint: string, @Res() response: Response) {
    const {
      tenant,
      session: { store: storeId },
    } = request
    return response.json(await getPaymentLinkByFingerprint(tenant, storeId, fingerprint))
  }
}
