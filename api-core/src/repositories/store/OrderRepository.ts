import { BaseRepository } from '../base/BaseRepository'
import { Order } from '../../models/store/Order'
import { EntityRepository } from 'typeorm'

@EntityRepository(Order)
export class OrderRepository extends BaseRepository<Order> {}
