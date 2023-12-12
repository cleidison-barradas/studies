
export type IFiscalDocumentTye = 100 | 200 | 300

export interface NfeData {
  nfe_key?: string,
  nfe_link?: string,
  nfe_serie?: string,
  nfe_number?: string
  fiscal_document_type: IFiscalDocumentTye
}