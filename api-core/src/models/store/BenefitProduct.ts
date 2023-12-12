import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

@Entity({ name: 'benefitproduct' }, ConnectionType.Store)
export class BenefitProduct extends BaseModel {
  @Column({
    type: 'text'
    })
  ean: string

  @Column({
    type: 'text'
    })
  name: string

  @Column({
    type: 'number'
    })
  maximumPrice: number

  @Column({
    type: 'number'
    })
  salePrice: number

  @Column({
    type: 'number'
    })
  discountPercent: number

  @Column({
    type: 'number'
    })
  benefitId: number

  @Column({
    type: 'number'
    })
  replacementIndustryPrice: number

  @Column({
    type: 'number'
    })
  replacementPurchasePrice: number

  @Column({
    type: 'number'
    })
  replacementIndustryDiscount: number

  @Column({
    type: 'text'
    })
  commercialGrade: string

  @Column({
    type: 'number'
    })
  commercialGradeId: number

  @Column({
    type: 'text'
    })
  presentation: string

  @Column({
    type: 'number'
    })
  calculationRuleTypeId: number

  @Column({
    type: 'number'
    })
  calculationRuleType: number
}
