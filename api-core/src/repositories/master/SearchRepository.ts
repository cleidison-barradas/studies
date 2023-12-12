import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { Search } from '../../models/master/Search'

@EntityRepository(Search)
export class SearchRepository extends BaseRepository<Search> {}
