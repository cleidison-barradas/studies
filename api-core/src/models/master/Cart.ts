import { Column } from 'typeorm'
import { Product } from '../store/Product'
import { BaseModel } from '../base/BaseModel'
import { Entity } from '../../plugins/orm/Entity'
import { ConnectionType } from '../../enums/ConnectionType'
import { Cupom } from '../store/Cupom'

export type IPurchaseType = 'NO' | 'YES'
export type IOriginPathType = 'search' | 'showcase' | 'categories'

export interface CartProductRequest {
  origin?: IOriginPathType
  product: Product
  quantity: number
}

@Entity({ name: 'cart' }, ConnectionType.Master)
export class Cart extends BaseModel {

  @Column({
    type: 'text'
    })
  storeId: string

  @Column({
    type: 'text',
    })
  customerId: string

  @Column({
    type: 'text',
    })
  name: string

  @Column({
    type: 'text',
    })
  email: string

  @Column({
    type: 'uuid',
    unique: true
    })
  fingerprint: string

  @Column()
  cupom: Cupom

  @Column({
    type: 'string',
    enum: ['YES', 'NO']
    })
  purchased: IPurchaseType

  @Column({
    type: 'array',
    default: [],
    })
  products: CartProductRequest[]
}

