import {
  BaseMiddleware,
  ORM,
  Exception,
  
  ObjectID,

  IntegrationSessionRepository,
  IntegrationUserRepository
} from '@mypharma/api-core'
import { verifyToken } from '../plugins/jwt'

export class ETLAuthMiddleware extends BaseMiddleware {
  protected async handler(request: any, response: any, next: any): Promise<Exception | void> {
    const xToken = request.headers['x-token'] as string | undefined
    const xUserId = request.headers['x-user-id'] as string | undefined
    const bearerToken = request.headers?.authorization?.replace('Bearer ', '')

    // Setup database connection
    await ORM.setup(null, 'integration')

    if (xToken && xUserId) {
      let userWhere = {}

      if (isNaN(xUserId as any)) {
        userWhere = {
          'user._id': new ObjectID(xUserId)
        }
      } else {
        const user = await IntegrationUserRepository.repo('integration').findByOriginalId(Number(xUserId))
        if (!user) {
          return response.status(403).json(Exception.InvalidSessionException('User does not exists'))
        }

        userWhere = {
          $or: [
            {
              'user._id': new ObjectID(user._id.toString())
            },
            {
              'user._id': user._id.toString()
            }
          ]
        }
      }

      const session = await IntegrationSessionRepository.repo('integration').findOne({
        where: {
          ...userWhere,
          token: xToken,
          'user.active': true
        }
      })

      if (!session) {
        return response.status(403).json(Exception.InvalidSessionException('Session does not exists'))
      }

      request.session = session
      return await next()
    }

    if (bearerToken) {
      const tokenPayload = await verifyToken(bearerToken)
      
      // Invalid token
      if (!tokenPayload) {
        return response.status(403).json(Exception.InvalidSessionException('JWT Token invalid'))
      }

      const { user_id } = tokenPayload
      const session = await IntegrationSessionRepository.repo('integration').findOne({
        where: {
          'user.active': true,
          'user.originalId': user_id,
          token: xToken
        }
      })

      if (!session) {
        return response.status(403).json(Exception.InvalidSessionException('Session does not exists'))
      }

      request.session = session
      return await next()
    }

    return response.status(403).json(Exception.InvalidSessionException('Missing authorization'))
  }
}
