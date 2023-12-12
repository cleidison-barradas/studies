import { BaseRepository } from '../base/BaseRepository'
import { IntegrationAuth } from '../../models/integration/IntegrationAuth'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationAuth)
export class IntegrationAuthRepository extends BaseRepository<IntegrationAuth> {}
