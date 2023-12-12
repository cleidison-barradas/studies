import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { NotificationCustomer } from '../../models/master/NotificationCustomer'

@EntityRepository(NotificationCustomer)
export class NotificationCustomerRepository extends BaseRepository<NotificationCustomer> {}
