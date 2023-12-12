import { BaseRepository } from '../base/BaseRepository'
import { StoneOrder } from '../../models/store/StoneOrder'
import { EntityRepository } from 'typeorm'
@EntityRepository(StoneOrder)
export class StoneOrderRepository extends BaseRepository<StoneOrder>{
}