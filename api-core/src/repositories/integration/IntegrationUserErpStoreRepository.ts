import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { IntegrationUserErpStore } from '../../models/integration/IntegrationUserErpStore'

@EntityRepository(IntegrationUserErpStore)
export class IntegrationUserErpStoreRepository extends BaseRepository<IntegrationUserErpStore> {}
