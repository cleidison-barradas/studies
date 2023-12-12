/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express'
import { BaseMiddleware } from './BaseMiddleware'
import { ORM } from '../plugins/orm/ORM'
import { ApiRequest } from '../interfaces/app/ApiRequest'
import { RequestLogRepository } from '../repositories/log/RequestLogRepository'
import { ObjectID } from '../helpers/ObjectID'

// Exceptions
import { Exception } from '../exceptions/Exception'
import { RequestLog } from '../models/log/RequestLog'

export class LogMiddleware extends BaseMiddleware {
  protected async handler(request: ApiRequest, response: Response, next: NextFunction): Promise<Exception | void> {
    const session = request.session as any

    const sessionId = session ? new ObjectID(session._id.toString()) : null
    const sessionModel = session && session.constructor ? session.constructor.name : null

    const userId = session && session.user ? new ObjectID(session.user._id.toString()) : null
    const userModel = session && session.user ? session.user.constructor.name : null

    await ORM.setup(null, 'log')

    const log = RequestLog.load({
      url: request.url,
      method: request.method,
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      body: request.body || null,
      headers: request.headers,
      sessionId: sessionId,
      sessionModel: sessionModel,
      userId: userId,
      userModel: userModel
    })

    await RequestLogRepository.repo('log').createDoc(log)

    next()
  }
}
