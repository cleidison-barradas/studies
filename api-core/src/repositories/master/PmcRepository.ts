import { BaseRepository } from '../base/BaseRepository'
import { Pmc } from '../../models/master/Pmc'
import { EntityRepository } from 'typeorm'

@EntityRepository(Pmc)
export class PmcRepository extends BaseRepository<Pmc> {}
