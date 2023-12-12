import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base/BaseRepository'
import { Manufacturer } from '../../models/store/Manufacturer'

@EntityRepository(Manufacturer)
export class ManufacturerRepository extends BaseRepository<Manufacturer> {}
