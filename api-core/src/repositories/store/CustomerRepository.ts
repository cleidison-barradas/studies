import { BaseRepository } from '../base/BaseRepository'
import { Customer } from '../../models/store/Customer'
import { EntityRepository } from 'typeorm'

@EntityRepository(Customer)
export class CustomerRepository extends BaseRepository<Customer> {}
