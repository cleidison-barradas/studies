import { BaseRepository } from '../base/BaseRepository'
import { DeliverySchedule } from '../../models/store/DeliverySchedule'
import { EntityRepository } from 'typeorm'

@EntityRepository(DeliverySchedule)
export class DeliveryScheduleRepository extends BaseRepository<DeliverySchedule> {}
