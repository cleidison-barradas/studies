import { Response, NextFunction } from 'express'
import { ApiRequest } from '../interfaces/app/ApiRequest'
import { BaseMiddleware } from './BaseMiddleware'
import { Exception } from '../exceptions/Exception'
import { KeyPairsRepository } from '../repositories/master/KeyPairsRepository'

export class AuthMiddleware extends BaseMiddleware {
  protected async handler(request: ApiRequest, response: Response, next: NextFunction): Promise<Exception | void> {
    const keyPairs = await KeyPairsRepository.repo().findOne({
      where: {
        name: 'jwt',
      },
    })

    if (!keyPairs) {
      return Exception.InternalErrorException('Key pairs not found')
    }

    // const token = request.headers?.authorization?.replace('Bearer ', '') || ''

    try {
      // const tokenData = JWT.verify(token, keyPairs.publicKey) as any

      // request.session = tokenData
      await next()
    } catch (e) {
      return Exception.InvalidSessionException('Invalid session')
    }
  }
}
