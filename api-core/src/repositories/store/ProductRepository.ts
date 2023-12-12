import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { Product } from '../../models/store/Product'

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {}
