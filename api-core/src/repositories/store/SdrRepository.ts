import { Sdr } from '../../models/store/SDR'
import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(Sdr)
export class SdrRepository extends BaseRepository<Sdr> {}
