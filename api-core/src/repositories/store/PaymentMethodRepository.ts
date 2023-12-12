import { BaseRepository } from '../base/BaseRepository'
import { PaymentMethod } from '../../models/store/PaymentMethod'
import { EntityRepository } from 'typeorm'
@EntityRepository(PaymentMethod)
export class PaymentMethodRepository extends BaseRepository<PaymentMethod> {}
