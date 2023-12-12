import { BaseRepository } from '../base/BaseRepository'
import { StorePlan } from '../../models/master/StorePlan'
import { EntityRepository } from 'typeorm'

@EntityRepository(StorePlan)
export class StorePlanRepository extends BaseRepository<StorePlan> {}
