import { BaseRepository } from '../base/BaseRepository'
import { Address } from '../../models/store/Address'
import { EntityRepository } from 'typeorm'

@EntityRepository(Address)
export class AddressRepository extends BaseRepository<Address> {}
