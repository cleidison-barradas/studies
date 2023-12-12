import { BaseRepository } from '../base/BaseRepository'
import { PagseguroOrder } from '../../models/store/PagseguroOrder'
import { EntityRepository } from 'typeorm'

@EntityRepository(PagseguroOrder)
export class PagseguroOrderRepository extends BaseRepository<PagseguroOrder> {}
