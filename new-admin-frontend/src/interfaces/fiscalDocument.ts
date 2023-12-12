
/**
 *  - 100 Cupom
 *  - 200 NFe
 *  - 300 CFe
 */
type IFiscalDocumentType = 100 | 200 | 300

export interface IFiscalDocument {
  fiscalDocumentType: IFiscalDocumentType
  fiscalDocumentKey: string | null
  fiscalDocumentLink: string | null
  fiscalDocumentSerie: string | null
  fiscalDocumentReceipt: string | null
}

export interface IOrderDispatch {
  trackUrl: string | null
  trackCode: string | null
  shippingMethod: string | null
  shippingCompany: string | null
}

export interface SubmitFiscalDocumentForm {
  fiscalDocument: IFiscalDocument
}

export interface SubmitOrderDispatch {
  orderDispatch: IOrderDispatch
}