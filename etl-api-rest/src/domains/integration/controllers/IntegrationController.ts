import { Get, JsonController, UseBefore, ApiRequest, Req, IntegrationSession, LogMiddleware, UseAfter } from '@mypharma/api-core'
import { ETLAuthMiddleware } from '../../../support/middlewares/ETLAuthMiddleware'

@JsonController('/v1/integration')
@UseBefore(ETLAuthMiddleware)
@UseAfter(LogMiddleware)
export class IntegrationContrller {
  @Get('/sqls/select')
  public sqlSelect(@Req() request: ApiRequest) {
    const session = request.session as IntegrationSession

    return {
      status: 'ok',
      data: {
        multistore: session.user.erpVersion.multistore || false,
        identifiers: session.user.erpVersion.storeIdentifiers || [],
        identifierField: session.user.erpVersion.identifierField || null,
        productSchema: session.user.erpVersion.schema || null,
        commands: session.user.erpVersion.sql ? session.user.erpVersion.sql.map(v => v.command) : []
      }
    }
  }
}
