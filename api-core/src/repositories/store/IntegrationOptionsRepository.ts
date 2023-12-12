import { BaseRepository } from '../base/BaseRepository'
import { IntegrationOptions } from '../../models/store/IntegrationOptions'
import { EntityRepository } from 'typeorm'
@EntityRepository(IntegrationOptions)
export class IntegrationOptionsRepository extends BaseRepository<IntegrationOptions> {}
