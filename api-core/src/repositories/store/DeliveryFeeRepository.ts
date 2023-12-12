import { BaseRepository } from '../base/BaseRepository'
import { DeliveryFee } from '../../models/store/DeliveryFee'
import { EntityRepository } from 'typeorm'

@EntityRepository(DeliveryFee)
export class DeliveryFeeRepository extends BaseRepository<DeliveryFee> {}
