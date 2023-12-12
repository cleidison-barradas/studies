import { BaseRepository } from '../../../support/repositories/BaseRepository'
import { IntegrationUserRepository, IntegrationSessionRepository, IntegrationErpRepository, IntegrationErpVersionRepository } from '@mypharma/api-core'
import { IUser, IErpVersion, MySQLPlugin } from '@mypharma/etl-engine'

class UserRepository extends BaseRepository<IUser> {
  async getUser(userId: number, token: string): Promise<any> {
    const foundSessions = await IntegrationSessionRepository.repo().find({
      where: {
        token
      }
    })

    if (foundSessions.length === 0) return null

    const session = foundSessions.find(v => v.user?.originalId === userId) || foundSessions[0]

    if (session) {
      const user = await IntegrationUserRepository.repo().findById(session.user._id)

      // Fix user
      if (!session.user.originalId) {
        session.user = user
      }

      if (!session.user.storeOriginalId || !session.user.erpVersion.erpId || !session.user.originalId) {
        console.log(`WARNING: User ${session.user.username} (${session.user.originalId}) has an invalid embedded at Session!`)
      }

      // Fix erpVersion
      if (session.user.erpVersion._id === session.user.erpVersion.erpId) {
        session.user.erpVersion = await IntegrationErpVersionRepository.repo().findById(session.user.erpVersion._id)
      }

      // Get ERP
      const erp = await IntegrationErpRepository.repo().findById(session.user.erpVersion.erpId)
      if (!erp) {
        console.log(session.user)
      }

      return {
        userId: session.user.originalId,
        token: session.token,
        privateKey: session.privateKey,
        publicKey: session.publicKey,
        store: {
          store_id: session.user.store?._id,
          original_id: session.user.storeOriginalId,
          name: session.user.storeOriginalName,
          url: session.user.store?.url || ''
        },
        erpVersion: {
          id: session.user.erpVersion.originalId,
          name: session.user.erpVersion.name,
          erp_id: session.user.erpVersion.erpId,
          erp: {
            id: erp._id,
            name: erp.name
          }
        }
      }
    }

    return null

    // const sql = `
    //   SELECT
    //     u.user_id as 'userId',
    //     u.token,
    //     u.privateKey,
    //     u.publicKey,
    //     u.erp_version_id,
    //     s.store_id,
    //     s.name as 'store_name',
    //     s.url as 'store_url'
    //   FROM oc_integration_user as u
    //   INNER JOIN oc_store AS s ON s.store_id = u.store_id
    //   WHERE u.user_id = ? AND u.token = ?
    //   LIMIT 1
    // `

    // const query = await MySQLPlugin.query(sql, [userId, token])
    // return query.length > 0 && (query[0] as Array<any>).length > 0 ? query[0][0] as IUser : null
  }

  async getErpVersion(erpVersionId: number): Promise<IErpVersion> {
    const sql = `
      SELECT
        es.id,
        es.name,
        es.erp_id,
        er.name AS 'erp_name'
      FROM oc_erp_version AS es
      INNER JOIN oc_erp AS er ON er.id = es.erp_id
      WHERE es.id = ?
    `

    const query = await MySQLPlugin.query(sql, [erpVersionId])
    return query.length > 0 && (query[0] as Array<any>).length > 0 ? query[0][0] as IErpVersion : null
  }
}

export const userRepository = new UserRepository('oc_integration_user')
