import { BaseRepository } from '../base/BaseRepository'
import { Store } from '../../models/master/Store'
import { EntityRepository } from 'typeorm'

@EntityRepository(Store)
export class StoreRepository extends BaseRepository<Store> {}
