import { BaseRepository } from '../base/BaseRepository'
import { IntegrationLog } from '../../models/integration/IntegrationLog'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationLog)
export class IntegrationLogRepository extends BaseRepository<IntegrationLog> {}
