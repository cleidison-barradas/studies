import { BaseRepository } from '../base/BaseRepository'
import { IntegrationErp } from '../../models/integration/IntegrationErp'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationErp)
export class IntegrationErpRepository extends BaseRepository<IntegrationErp> {}
