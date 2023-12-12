import { PbmAuthorization, PbmOrder, PbmOrderRepository } from '@mypharma/api-core'

interface EpharmaCreatePreOrderDTO {
  orderId: string
  storeId: string
  authorization?: PbmAuthorization
}

class EpharmaCreatePreOrder {
  constructor(private repository?: any) { }

  public async createPreOrder({ storeId, orderId, authorization }: EpharmaCreatePreOrderDTO) {

    if (!authorization || authorization.productAuthorized.length <= 0) return null

    let preOrder = new PbmOrder()

    const { productAuthorized, authorizationId, elegibilityToken, tokenExpirationDate } = authorization

    if (!this.repository) {

      preOrder._id = undefined
      preOrder.orderId = orderId
      preOrder.storeId = storeId
      preOrder.status = 'PENDING'
      preOrder.saleId = null
      preOrder.saleReceipt = null
      preOrder.fiscalDocument = null
      preOrder.storeSequenceId = '1'
      preOrder.items = productAuthorized
      preOrder.authorizationId = authorizationId
      preOrder.elegibilityToken = elegibilityToken
      preOrder.expirationDate = tokenExpirationDate
      preOrder.createdAt = new Date()

      preOrder = await PbmOrderRepository.repo().createDoc(preOrder)
    }

    return preOrder
  }
}

export default EpharmaCreatePreOrder
