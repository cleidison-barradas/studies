import { BaseRepository } from '../base/BaseRepository'
import { Category } from '../../models/store/Category'
import { EntityRepository } from 'typeorm'

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {}
