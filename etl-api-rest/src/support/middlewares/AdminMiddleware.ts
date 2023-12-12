import { BaseMiddleware, Exception, ORM } from '@mypharma/api-core'
import { databaseConfig } from '../../config/database'

export class AdminMiddleware extends BaseMiddleware {
  protected async handler(request: any, response: any, next: any): Promise<Exception | void> {
    const xMasterToken = request.headers['authorization'] as string

    if (xMasterToken && xMasterToken === 'UHi{xeflK4(^!:rb2/e6O]enK}#%RTkd}zT{uoe5d/v|Q"G$0k-WI3fp>w|>W(^') {
      return next()
    }

    return response.status(403).json(Exception.InvalidSessionException('Invalid token'))
  }
}