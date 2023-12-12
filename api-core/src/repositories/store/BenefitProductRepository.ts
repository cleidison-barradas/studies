import { BaseRepository } from '../base/BaseRepository'
import { BenefitProduct } from '../../models/store/BenefitProduct'
import { EntityRepository } from 'typeorm'

@EntityRepository(BenefitProduct)
export class BenefitProductRepository extends BaseRepository<BenefitProduct> { }
