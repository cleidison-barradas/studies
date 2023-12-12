import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'
import { Category } from './Category'

@Entity({ name: 'subCategory' }, ConnectionType.Store)
export class SubCategory extends BaseModel {

  @Column()
  subCategories: Category[]

}
