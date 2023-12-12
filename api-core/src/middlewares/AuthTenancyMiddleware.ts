import {  NextFunction, Response } from 'express'
import JWT from 'jsonwebtoken'
import { BaseMiddleware } from './BaseMiddleware'
import { ORM } from '../plugins/orm/ORM'
import { KeyPairsRepository } from '../repositories/master/KeyPairsRepository'
import { AuthTenancyPayload } from '../interfaces/auth/AuthTenancyPayload'
import { ApiRequest } from '../interfaces/app/ApiRequest'

// Exceptions
import { Exception } from '../exceptions/Exception'
import { CustomerRepository } from '../repositories/store/CustomerRepository'


export class AuthTenancyMiddleware extends BaseMiddleware {
  protected async handler(request: ApiRequest, response: Response, next: NextFunction): Promise<Exception | void> {

    const keyPairs = await KeyPairsRepository.repo().findOne({
      where: {
        name: 'jwt'
      }
    })

    if (!keyPairs) {
      return response.status(500).json(Exception.InternalErrorException('Key pairs not found'))
    }

    const token = request.headers?.authorization?.replace('Bearer ', '') || ''

    try {
      const tokenData = JWT.verify(token, keyPairs.publicKey) as AuthTenancyPayload

      // Setup database connection
      await ORM.setup(null, tokenData.tenant)

      // Grab user
      const user = await CustomerRepository.repo<CustomerRepository>(tokenData.tenant).findById(tokenData.objectId)

      if (!user) {
        return response.status(404).json(Exception.UserNotFoundException('User not exist anymore'))
      }

      request.tenant = tokenData.tenant

      request.session = {
        ...request.session,
        user: user,
        store : tokenData.store
      }
      next()
    }
    catch (e) {
      console.log(e)
      return response.status(401).json(Exception.InvalidSessionException('Invalid session'))
    }
  }
}
