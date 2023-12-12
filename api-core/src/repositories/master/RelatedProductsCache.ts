import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { RelatedProductsCache } from '../../models/master/RelatedProductsCache'

@EntityRepository(RelatedProductsCache)
export class RelatedProductsCacheRepository extends BaseRepository<RelatedProductsCache> {}
