import sha1 from 'sha1'
import { Response } from 'express'
import {
  Res,
  Req,
  Get,
  Body,
  Post,
  ObjectID,
  UseAfter,
  Exception,
  UseBefore,
  ApiRequest,
  urlencoded,
  LogMiddleware,
  JsonController,
  IntegrationSession,
  IntegrationErpRepository,
  IntegrationUserRepository,
  IntegrationSessionRepository,
  IntegrationErpVersionRepository
} from '@mypharma/api-core'
import { ETLAuthMiddleware } from '../../../support/middlewares/ETLAuthMiddleware'
import { KeyService } from '../services/KeyService'
import { databaseConfig } from '../../../config/database'

@JsonController('/v2/account')
@UseAfter(LogMiddleware)
export class AccountController {
  @Get('/validate')
  @UseBefore(ETLAuthMiddleware)
  public async validate(@Req() request: ApiRequest, @Res() response: Response) {
    const session = request.session as IntegrationSession

    try {
      // Update ERP Version embedded
      const erpVersion = await IntegrationErpVersionRepository.repo(databaseConfig.name).findById(session.user.erpVersion._id)

      const parsedErpVersion = {
        ...erpVersion,
        _id: new ObjectID(erpVersion._id.toString()),
        erpId: new ObjectID(erpVersion.erpId)
      }

      await IntegrationUserRepository.repo(databaseConfig.name).updateOne({
        _id: new ObjectID(session.user._id.toString())
      }, {
        $set: { erpVersion: parsedErpVersion }
      })

      // Update lastSeen and user embedded
      const user = await IntegrationUserRepository.repo(databaseConfig.name).findById(session.user._id)
      await IntegrationSessionRepository.repo(databaseConfig.name).updateOne({
        _id: new ObjectID(session._id.toString())
      }, {
        $set: {
          lastSeen: new Date(),
          user: {
            ...user,
            erpVersion: parsedErpVersion,
            _id: new ObjectID(user._id)
          }
        }
      })

      // Remove others active sesssion
      await IntegrationSessionRepository.repo(databaseConfig.name).updateMany({
        _id: {
          $ne: new ObjectID(session._id.toString())
        },
        'user._id': new ObjectID(user._id)
      }, {
        $set: { deletedAt: new Date() }
      })

      return response.json({
        status: 'ok'
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Get('/renew')
  @UseBefore(ETLAuthMiddleware)
  public async renew(@Req() request: ApiRequest) {
    const { publicKey, privateKey } = KeyService.generateKeys()
    const session = request.session as IntegrationSession

    session.publicKey = publicKey
    session.privateKey = privateKey
    await session.save({ tenantName: databaseConfig.name })

    return {
      status: 'ok',
      data: {
        user_id: session.user._id.toString(),
        publicKey
      }
    }
  }

  @Post('/login')
  @UseBefore(urlencoded({ extended: true }))
  public async login(@Body() data: any) {
    const { username, password } = data || {}

    if (!username || !password) {
      return Exception.ValidationErrorException('Provide username and password')
    }

    const user = await IntegrationUserRepository.repo().findOne({
      where: {
        username
      }
    })

    if (!user) {
      return Exception.UserNotFoundException()
    }

    const encryptedPassword = sha1(user.salt + sha1(user.salt + sha1(password)))
    if (user.password !== encryptedPassword) {
      return Exception.FailedLoginException()
    }

    const session = await KeyService.generateTokens(user)
    const erp = await IntegrationErpRepository.repo().findOne({
      where: {
        _id: session.user.erpVersion.erpId
      }
    })

    return {
      status: 'ok',
      data: {
        user_id: user.originalId,
        erp_name: erp?.name || 'Unknown',
        token: session.token,
        publicKey: session.publicKey
      }
    }
  }
}
