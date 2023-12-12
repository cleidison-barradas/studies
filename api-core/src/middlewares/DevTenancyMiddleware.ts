import { Response, NextFunction } from 'express'
import { BaseMiddleware } from './BaseMiddleware'
import { ORM } from '../plugins/orm/ORM'
import { ApiRequest } from '../interfaces/app/ApiRequest'

// Exceptions
import { Exception } from '../exceptions/Exception'

export class DevTenancyMiddleware extends BaseMiddleware {
  protected async handler(request: ApiRequest, response: Response, next: NextFunction): Promise<Exception | void> {
    const tenantName: string = request.headers['dev_tenant_name'] as string || null
    if (!tenantName) {
      return response.json(Exception.InternalErrorException('DEV: dev_tenant_name name not supplied'))
    }

    // Setup database connection
    await ORM.setup(null, tenantName)

    request.tenant = tenantName
    await next()
  }
}
