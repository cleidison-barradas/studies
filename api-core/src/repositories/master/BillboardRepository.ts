import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { Billboard } from '../../models/master/Billboard'

@EntityRepository(Billboard)
export class BillboardRepository extends BaseRepository<Billboard> {}
