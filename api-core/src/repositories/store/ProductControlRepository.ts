import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { ProductControl } from '../../models/store/ProductControl'

@EntityRepository(ProductControl)
export class ProductControlRepository extends BaseRepository<ProductControl> {}
