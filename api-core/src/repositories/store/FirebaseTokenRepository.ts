import { EntityRepository } from 'typeorm'
import { FirebaseToken } from '../../models/store/FirebaseToken'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(FirebaseToken)
export class FirebaseTokenRepository extends BaseRepository<FirebaseToken> {}
