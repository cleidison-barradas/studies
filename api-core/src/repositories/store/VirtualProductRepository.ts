import { EntityRepository } from 'typeorm'
import { VirtualProduct } from '../../models/store/VirtualProduct'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(VirtualProduct)
export class VirtualProductRepository extends BaseRepository<VirtualProduct> { }
