import { BaseRepository } from '../base/BaseRepository'
import { IntegrationErpVersion } from '../../models/integration/IntegrationErpVersion'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationErpVersion)
export class IntegrationErpVersionRepository extends BaseRepository<IntegrationErpVersion> {}
