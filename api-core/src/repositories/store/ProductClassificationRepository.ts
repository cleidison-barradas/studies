import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { ProductClassification } from '../../models/store/ProductClassification'

@EntityRepository(ProductClassification)
export class ProductClassificationRepository extends BaseRepository<ProductClassification> {}
