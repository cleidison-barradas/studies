import { Column } from 'typeorm'
import { ConnectionType } from '../../enums/ConnectionType'
import { Entity } from '../../plugins/orm/Entity'
import { BaseModel } from '../base/BaseModel'

/**
 *  - 100 Cupom
 *  - 200 NFe
 *  - 300 CFe
 */
export type IFiscalDocumentType = 100 | 200 | 300

export type IStatusType = 'PENDING' | 'COMPLETED' | 'ERROR' | 'CANCEL'

export interface IFiscalDocument {
  fiscalDocumentType: IFiscalDocumentType,
  fiscalReceipt: string,
  fiscalPrinter: string
}

export interface ITransactionItems {
  ean: string,
  salePrice: number,
  categoryId: number,
  productName: string,
  factoryPrice: number,
  approvedQuantity: number
  storeMaximumPrice: number,
  retailTransferValue: number,
  unitAcquisitionPrice: number,
  rejectionReason: string,
}

@Entity({ name: 'pbmorder' }, ConnectionType.Master)
export class PbmOrder extends BaseModel {
  @Column({
    type: 'string'
    })
  orderId: string

  @Column({
    type: 'string'
    })
  storeId: string

  @Column({
    type: 'string'
    })
  saleId: string

  @Column({
    type: 'string'
    })
  saleReceipt: string

  @Column({
    type: 'string'
    })
  status: IStatusType

  @Column({
    type: 'string'
    })
  storeSequenceId: string

  @Column({
    type: 'number'
    })
  authorizationId: number

  @Column({
    type: 'string'
    })
  expirationDate: string

  @Column({
    type: 'string'
    })
  elegibilityToken: string

  @Column({
    type: 'json'
    })
  fiscalDocument: IFiscalDocument

  @Column({
    type: 'array'
    })
  items: ITransactionItems[]
}
