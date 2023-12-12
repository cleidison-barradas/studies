import { BaseRepository } from '../base/BaseRepository'
import { City } from '../../models/store/City'
import { EntityRepository } from 'typeorm'

@EntityRepository(City)
export class CityRepository extends BaseRepository<City> {}
