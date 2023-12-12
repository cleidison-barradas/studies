import { BaseRepository } from '../base/BaseRepository'
import { IntegrationMethods } from '../../models/store/IntegrationMethods'
import { EntityRepository } from 'typeorm'
@EntityRepository(IntegrationMethods)
export class IntegrationMethodsRepository extends BaseRepository<IntegrationMethods> {}
