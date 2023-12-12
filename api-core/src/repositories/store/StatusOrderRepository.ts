import { BaseRepository } from '../base/BaseRepository'
import { StatusOrder } from '../../models/store/StatusOrder'
import { EntityRepository } from 'typeorm'

@EntityRepository(StatusOrder)
export class StatusOrderRepository extends BaseRepository<StatusOrder> {}
