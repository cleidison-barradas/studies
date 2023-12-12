import { BaseRepository } from '../base/BaseRepository'
import { User } from '../../models/master/User'
import { EntityRepository } from 'typeorm'

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
