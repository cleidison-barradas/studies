import { BaseRepository } from '../base/BaseRepository'
import { HistoryOrder } from '../../models/store/HistoryOrder'
import { EntityRepository } from 'typeorm'

@EntityRepository(HistoryOrder)
export class HistoryOrderRepository extends BaseRepository<HistoryOrder> {}
