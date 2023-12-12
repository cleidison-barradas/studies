import { BaseRepository } from '../base/BaseRepository'
import { EntityRepository } from 'typeorm'
import { Cart } from '../../models/master/Cart'

@EntityRepository(Cart)
export class CartRepository extends BaseRepository<Cart> { }
