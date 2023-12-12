import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { PbmOrder } from '../../models/master/PbmOrder'

@EntityRepository(PbmOrder)
export class PbmOrderRepository extends BaseRepository<PbmOrder> { }
