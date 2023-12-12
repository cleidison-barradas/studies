import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { DistanceDeliveryFee } from '../../models/store/DistanceDeliveryFee'

@EntityRepository(DistanceDeliveryFee)
export class DistanceDeliveryFeeRepository extends BaseRepository<DistanceDeliveryFee> {}
