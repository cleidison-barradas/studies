import { Response, NextFunction } from 'express'
import { BaseMiddleware } from './BaseMiddleware'
import { ORM } from '../plugins/orm/ORM'
import { ApiRequest } from '../interfaces/app/ApiRequest'

// Exceptions
import { Exception } from '../exceptions/Exception'

export class NotificationHandlerMiddleware extends BaseMiddleware {
  protected async handler(request: ApiRequest, response: Response, next: NextFunction): Promise<Exception | void> {
    const tenantName: string = request.params['tenant'] as string || null
    if (!tenantName) {
      return response.json(Exception.InternalErrorException('TENANT_NOT_PROVIDED: tenant_not_provided'))
    }

    // Setup database connection
    await ORM.setup(null, tenantName)

    request.tenant = tenantName
    await next()
  }
}
