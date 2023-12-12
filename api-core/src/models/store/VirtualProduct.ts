import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Category } from './Category'
import { File } from './File'
import { Manufacturer } from './Manufacturer'
import { ProductControl } from './ProductControl'
import { Product } from './Product'

@Entity({ name: 'virtualProduct' }, ConnectionType.Store)

export class VirtualProduct extends Product {
}

