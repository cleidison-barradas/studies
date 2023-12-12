import { Cart, Store } from '@mypharma/api-core'

import { IPrescriptorData } from '../../../../adapters/interfaces/epharma'

import EpharmaService from '../../../../adapters/EpharmaService'
import EpharmaGetAuthorizationService from './EpharmaGetAuthorizationService'
import EpharmaUpdateAuthorizationService from './EpharmaUpdateAuthorizationService'
import EpharmaBuildAuthorizeItemsService from './EpharmaBuildAuthorizeItemsService'

interface EpharmaTransactionAuthorizeServiceDTO {
  cart?: Cart
  store: Store
  eans: string[]
  tenant: string
  fingerprint: string
  elegibilityToken: string
  prescriptor: IPrescriptorData
}

class EpharmaTransactionAuthorizeService {

  private epharmaService: EpharmaService
  private epharmaGetAuthorizationService: EpharmaGetAuthorizationService
  private epharmaUpdateAuthorizationService: EpharmaUpdateAuthorizationService
  private epharmaBuildAuthorizeItemsService: EpharmaBuildAuthorizeItemsService

  constructor(private repository?: any) {
    this.epharmaService = new EpharmaService()
    this.epharmaGetAuthorizationService = new EpharmaGetAuthorizationService()
    this.epharmaUpdateAuthorizationService = new EpharmaUpdateAuthorizationService()
    this.epharmaBuildAuthorizeItemsService = new EpharmaBuildAuthorizeItemsService()
  }

  public async transactionAuthorize({ tenant, cart, eans, store, fingerprint, elegibilityToken, prescriptor }: EpharmaTransactionAuthorizeServiceDTO) {
    const storeId = store._id.toString()

    // setup config
    this.epharmaService.config({ store })

    const [day, month, year] = prescriptor.prescriptorRecipeDate.split('/')
    const date = new Date(Number(year), Number(month) - 1, Number(day))

    const accessToken = await this.epharmaService.authenticate({ storeId })

    const items = await this.epharmaBuildAuthorizeItemsService.buildTransactionAuthorizeItems({ tenant, eans, cart })

    const authorizeTransaction = await this.epharmaService.postAuthorizeTransaction({
      accessToken,
      prescription: {
        date,
        prescriptor
      },
      items,
      elegibilityToken,
      storeSequenceId: 6669,
    })

    if (authorizeTransaction.error) {
      console.log(authorizeTransaction)

      throw new Error('authorization_items_failure')
    }
    const { items: productAuthorized, authorizationId } = authorizeTransaction.data

    const productRejected = productAuthorized.find(_product => _product.approvedQuantity <= 0)

    if (productRejected) {
      console.log(productRejected)

      throw new Error('product_needs_membership')
    }

    let authorization = await this.epharmaGetAuthorizationService.getAuthorization({ storeId, fingerprint })

    if (authorization) {
      authorization.prescriptor = prescriptor
      authorization.authorizationId = authorizationId
      authorization.productAuthorized = productAuthorized

      authorization = await this.epharmaUpdateAuthorizationService.updateAuthorization({ authorization })
    }


    return authorization
  }
}

export default EpharmaTransactionAuthorizeService
