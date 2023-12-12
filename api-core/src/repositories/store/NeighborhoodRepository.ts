import { BaseRepository } from '../base/BaseRepository'
import { Neighborhood } from '../../models/store/Neighborhood'
import { EntityRepository } from 'typeorm'

@EntityRepository(Neighborhood)
export class NeighborhoodRepository extends BaseRepository<Neighborhood> {}
