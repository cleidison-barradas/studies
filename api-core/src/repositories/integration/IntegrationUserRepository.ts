import { BaseRepository } from '../base/BaseRepository'
import { IntegrationUser } from '../../models/integration/IntegrationUser'
import { EntityRepository } from 'typeorm'

@EntityRepository(IntegrationUser)
export class IntegrationUserRepository extends BaseRepository<IntegrationUser> {}
