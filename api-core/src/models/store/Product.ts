import { ObjectID } from 'mongodb'
import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Benefit } from './Benefit'
import { Category } from './Category'
import { File } from './File'
import { Manufacturer } from './Manufacturer'
import { ProductClassification } from './ProductClassification'
import { ProductControl } from './ProductControl'
import { ISpecials } from './specials'

export interface IProductPmcValue {
  ean: string
  value: number
  region_id: ObjectID
}

@Entity({ name: 'product' }, ConnectionType.Store)
export class Product extends BaseModel {
  @Column({ type: 'string', unique: true, })
  EAN: string

  @Column({ type: 'string', unique: true, })
  MS: string

  @Column({ type: 'string', unique: true, })
  sku: string

  @Column({ type: 'string', nullable: false, })
  name: string

  @Column({ type: 'string', nullable: false, })
  model: string

  @Column({ type: 'string', })
  presentation: string

  @Column({ type: 'string', })
  description: string

  @Column()
  image: File | null

  @Column()
  imageUrl?: string

  @Column()
  category: Category[]

  @Column()
  manufacturer: Manufacturer

  @Column()
  classification: ProductClassification

  @Column()
  control: ProductControl

  @Column({ type: 'string', })
  activePrinciple: string

  @Column({ type: 'boolean', })
  status: boolean

  @Column({ type: 'boolean', })
  verify: boolean

  @Column({ type: 'number', })
  quantity: number

  @Column({ type: 'number', })
  price: number

  @Column({ type: 'number', nullable: true, })
  erp_pmc: number

  @Column({ type: 'datetime', nullable: true, })
  lastStock: Date | null

  @Column({ type: 'array', })
  genericPattern: string[]

  @Column({ type: 'array', })
  slug: string[]

  @Column({ type: 'string', })
  metaTitle: string

  @Column({ type: 'string', })
  metaDescription: string

  @Column()
  specials: ISpecials[]

  @Column({ type: 'boolean', default: true, })
  manualPMC: boolean

  @Column({ type: 'number', })
  pmcPrice: number

  @Column({ type: 'boolean', })
  priceLocked: boolean

  @Column({ type: 'boolean', })
  quantityLocked: boolean

  @Column({ type: 'boolean', enum: ['store', 'support'], default: 'store', })
  updatedBy: string

  @Column({ type: 'enum', enum: ['store', 'etl', 'docas'], default: 'store', })
  updateOrigin: string

  @Column()
  pmcValues: IProductPmcValue[]

  @Column({ type: 'number', })
  weight: number

  @Column({ type: 'number', })
  length: number

  @Column({ type: 'number', })
  width: number

  @Column({ type: 'number', })
  height: number

  @Column({ type: 'string', })
  leaflet: string

  @Column({ type: 'boolean', nullable: true, default: false, })
  continuousUse: boolean

  @Column()
  benefit: Benefit

  @Column({
    type: 'number',
    default: 0,
    })
  benefit_sale_price: boolean
}