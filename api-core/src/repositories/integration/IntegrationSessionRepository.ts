import { BaseRepository } from '../base/BaseRepository'
import { IntegrationSession } from '../../models/integration/IntegrationSession'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationSession)
export class IntegrationSessionRepository extends BaseRepository<IntegrationSession> {}
