import { BaseRepository } from '../base/BaseRepository'
import { Sitemaps } from '../../models/store/Sitemaps'
import { EntityRepository } from 'typeorm'
@EntityRepository(Sitemaps)
export class SitemapsRepository extends BaseRepository<Sitemaps>{
}