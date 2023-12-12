export interface IEpharmaAuthorizationDataKeys {
  authorizationId: number
  elegibilityToken: string
  expirationDate: string | Date
}

export interface ProductAuthorized {
  ean: string,
  salePrice: number,
  categoryId: number,
  productName: string,
  factoryPrice: number,
  approvedQuantity: number
  rejectionReason?: string,
  storeMaximumPrice: number,
  retailTransferValue: number,
  unitAcquisitionPrice: number,
}