import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { OrderShipping } from '../../models/store/OrderShipping'

@EntityRepository(OrderShipping)
export class OrderShippingRepository extends BaseRepository<OrderShipping> {}
