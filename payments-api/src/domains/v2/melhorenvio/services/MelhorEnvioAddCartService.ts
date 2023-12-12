import { Order, RedisPlugin, Store } from '@mypharma/api-core'
import MelhorEnvioPlugin from '../../../../support/plugins/MelhorEnvioPlugin'
import { getSenderOrigin } from '../helpers/GetSenderOrigin'
import { getReceiver } from '../helpers/GetReceiver'
import { getShippingProducts } from '../helpers/GetShippingProducts'
import { getShippingPackage } from '../helpers/GetShippingPackage'
import { IShipping } from '../../../../interfaces/shipping'
import { getShippingOptions } from '../helpers/GetShippingOptions'
import { ISender } from '../../../../interfaces/sender'

interface MelhorEnvioAddCartServiceDTO {
  order: Order
  store: Store
  sender: ISender
  shipping: IShipping | null
}
class MelhorEnvioAddCartService {

  public async addMelhorEnvioCart({ order, store, sender, shipping }: MelhorEnvioAddCartServiceDTO) {

    if (!shipping || sender !== 'bestshipping') return null

    const storeId = store._id.toString()
    const orderId = order._id.toString()

    const redisKey = `store_access_token_cache_${storeId}`

    const accessToken: string | null = await RedisPlugin.get(redisKey)

    const melhorEnvioPlugin = new MelhorEnvioPlugin({ accessToken })

    const { settings } = await melhorEnvioPlugin.getAppSettings()

    let agency = undefined
    const receipt = settings.receipt
    const own_hand = settings.own_hand
    const service = shipping.id.toString()
    const platform = new URL(store.url).href
    const insurance_value = order.totalOrder

    const from = getSenderOrigin(store)
    const to = getReceiver(order.customer)
    const products = getShippingProducts(order.products)
    const volumes = getShippingPackage(shipping.packages)
    const options = getShippingOptions({ insurance_value, receipt, own_hand, platform, orderId })

    if (shipping.company.name.toLowerCase().includes('jadlog')) {

      if (!settings.jadlog_agency || settings.jadlog_agency === 0) {

        throw new Error('agency_not_defined')
      }

      agency = settings.jadlog_agency.toString()
    }

    const responseCartAdded = await melhorEnvioPlugin.addToCart({ to, from, service, products, volumes, options, accessToken, agency })

    return responseCartAdded

  }
}

export default MelhorEnvioAddCartService
