import { BaseRepository } from '../base/BaseRepository'
import { Banner } from '../../models/store/Banner'
import { EntityRepository } from 'typeorm'

@EntityRepository(Banner)
export class BannerRepository extends BaseRepository<Banner> {}
