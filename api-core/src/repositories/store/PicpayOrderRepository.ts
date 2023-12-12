import { BaseRepository } from '../base/BaseRepository'
import { PicpayOrder } from '../../models/store/PicpayOrder'
import { EntityRepository } from 'typeorm'

@EntityRepository(PicpayOrder)
export class PicpayOrderRepository extends BaseRepository<PicpayOrder> {}
