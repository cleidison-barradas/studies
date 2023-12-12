import keypair from 'keypair'
import * as crypto from 'crypto'
import { IntegrationSession, IntegrationSessionRepository, IntegrationUser } from '@mypharma/api-core'
import { databaseConfig } from '../../../config/database'

export class KeyService {
  public static generateKeys() {
    // Create a pair of keys
    const keys = keypair()

    return {
      privateKey: keys.private,
      publicKey: keys.public
    }
  }

  public static generateTokens(user: IntegrationUser): Promise<IntegrationSession> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, async (err, buffer) => {
        if (err) reject(err)
        else {
          const token = buffer.toString('hex')

          // Get existing session
          let session = await IntegrationSessionRepository.repo(databaseConfig.name).findOne({
            where: {
              'user._id': user._id
            }
          })

          // Remove existing session
          if (session) {
            await session.softDelete()
          }

          // Get keys
          const { publicKey, privateKey } = this.generateKeys()

          session = IntegrationSession.load({
            user: user,
            token: token,
            publicKey: publicKey,
            privateKey: privateKey,
            lastSeen: new Date()
          })

          session = await IntegrationSessionRepository.repo(databaseConfig.name).createDoc(session)

          resolve(session)
        }
      })
    })
  }
}