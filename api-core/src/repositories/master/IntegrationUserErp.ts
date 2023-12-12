import { BaseRepository } from '../base/BaseRepository'
import { IntegrationUserErp } from '../../models/master/IntegrationUserErp'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationUserErp)
export class IntegrationUserErpRepository extends BaseRepository<IntegrationUserErp> {}
