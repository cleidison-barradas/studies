import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { AboutUs } from '../../models/store/AboutUs'

@EntityRepository(AboutUs)
export class AboutUsRepository extends BaseRepository<AboutUs> {}
