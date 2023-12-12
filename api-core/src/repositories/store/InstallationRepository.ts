import { BaseRepository } from '../base/BaseRepository'
import { Installation } from '../../models/store/Installation'
import { EntityRepository } from 'typeorm'

@EntityRepository(Installation)
export class InstallationRepository extends BaseRepository<Installation> {}
