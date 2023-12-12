import { EntityRepository } from 'typeorm'
import { NotificationSlack } from '../../models/master/NotificationSlack'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(NotificationSlack)
export class NotificationSlackRepository extends BaseRepository<NotificationSlack> { }
