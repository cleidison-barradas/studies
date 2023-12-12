import { EntityRepository } from 'typeorm'
import { Notification } from '../../models/master/Notification'
import { BaseRepository } from '../base/BaseRepository'

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> { }
