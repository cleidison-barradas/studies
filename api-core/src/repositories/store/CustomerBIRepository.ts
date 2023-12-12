import { BaseRepository } from '../base/BaseRepository'
import { CustomerBI } from '../../models/store/CustomerBI'
import { EntityRepository } from 'typeorm'

@EntityRepository(CustomerBI)
export class CustomerBIRepository extends BaseRepository<CustomerBI> {}
