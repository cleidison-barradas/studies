import { DeepPartial, EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { IntegrationMonitorSession } from '../../models/integration/IntegrationMonitorSession'

@EntityRepository(IntegrationMonitorSession)
export class IntegrationMonitorSessionRepository extends BaseRepository<IntegrationMonitorSession> {
  public getSession(userId: number, token: string): Promise<IntegrationMonitorSession> {
    return this.findOne({
      where: {
        'user.originalId': Number(userId),
        token
      }
    })
  }

  public async updateConnection(userId: number, data: DeepPartial<IntegrationMonitorSession>): Promise<IntegrationMonitorSession> {
    await this.updateOne({
      'user.originalId': Number(userId)
    }, {
      $set: data
    })

    return await this.findByOriginalId(userId)
  }
}
