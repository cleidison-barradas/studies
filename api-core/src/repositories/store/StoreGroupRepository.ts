import { BaseRepository } from '../base/BaseRepository'
import { StoreGroup } from '../../models/store/StoreGroup'
import { EntityRepository } from 'typeorm'

@EntityRepository(StoreGroup)
export class StoreGroupRepository extends BaseRepository<StoreGroup> {}
