import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { Remarketing } from '../../models/master/Remarketing'

@EntityRepository(Remarketing)
export class RemarketingRepository extends BaseRepository<Remarketing> {}
