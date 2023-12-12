
type IPbmPreOrderTypeStatus = 'PENDING' | 'COMPLETED' | 'ERROR' | 'CANCEL'

/**
 *  - 100 Cupom
 *  - 200 NFe
 *  - 300 CFe
 */
type IFiscalDocumentType = 100 | 200 | 300

interface IFiscalDocument {
  fiscalReceipt: string
  fiscalPrinter: string
  fiscalDocumentType: IFiscalDocumentType
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

export interface IPbmPreOrder {
  _id: string,
  storeId: string,
  orderId: string,
  comments?: string
  expirationDate: string
  storeSequenceId: string,
  authorizationId: number,
  elegibilityToken: string
  items: ITransactionItems[],
  status: IPbmPreOrderTypeStatus,
  fiscalDocument: IFiscalDocument,
  createdAt: Date,
  updatedAt: Date
}