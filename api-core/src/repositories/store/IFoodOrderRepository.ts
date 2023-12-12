import { BaseRepository } from '../base/BaseRepository'
import { IFoodOrder } from '../../models/store/IFoodOrder'
import { EntityRepository } from 'typeorm'

@EntityRepository(IFoodOrder)
export class IFoodOrderRepository extends BaseRepository<IFoodOrder> {}
