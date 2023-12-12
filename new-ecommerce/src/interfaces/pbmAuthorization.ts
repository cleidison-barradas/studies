import { IPrescriptorData } from "./epharma"

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

export interface PBMAuthorization {
  _id: string
  fingerprint: string
  elegibilityToken: string
  tokenExpirationDate: string
  productAuthorized: ProductAuthorized[]
  prescriptor: IPrescriptorData
  updatedAt: Date
  createdAt: Date
}


