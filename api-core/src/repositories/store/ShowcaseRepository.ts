import { BaseRepository } from '../base/BaseRepository'
import { Showcase } from '../../models/store/Showcase'
import { EntityRepository } from 'typeorm'

@EntityRepository(Showcase)
export class ShowcaseRepository extends BaseRepository<Showcase> {}
