import { BaseRepository } from '../base/BaseRepository'
import { Benefit } from '../../models/store/Benefit'
import { EntityRepository } from 'typeorm'

@EntityRepository(Benefit)
export class BenefitRepository extends BaseRepository<Benefit> { }
