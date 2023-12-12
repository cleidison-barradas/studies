import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { PbmAuthorization } from '../../models/master/PbmAuthorization'

@EntityRepository(PbmAuthorization)
export class PbmAuthorizationRepository extends BaseRepository<PbmAuthorization> { }
