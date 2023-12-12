import { Address, DeliveryFee, DistanceDeliveryFee, Neighborhood, ObjectID, OrderProducts, PaymentLinkRepository, Store } from '@mypharma/api-core'
import { Coordinate } from '../../../../helpers/getDistanceBetweenCoordinates'
import { IDeliveryMode } from '../../../../interfaces/deliveryMode'
import { IShipping } from '../../../../interfaces/shipping'
import DeliveryGetFeeByDistanceService from './DeliveryGetFeeByDistanceService'
import DeliveryGetFeeByNeighborhoodIdService from './DeliveryGetFeeByNeighborhoodIdService'

const deliveryGetFeeByNeighborhoodIdService = new DeliveryGetFeeByNeighborhoodIdService()
const deliveryGetFeeByDistanceService = new DeliveryGetFeeByDistanceService()

interface RequestGetDeliveryServiceDTO {
  tenant: string
  address?: Address
  shipping?: IShipping
  products: OrderProducts[]
  deliveryMode: IDeliveryMode
  paymentLinkId?: ObjectID
  store?: Store
  paymentMethod?: string
}

class DeliveryGetService {
  public async execute({
    tenant,
    address,
    products,
    deliveryMode = 'own_delivery',
    shipping = null,
    paymentLinkId,
    paymentMethod,
    store
  }: RequestGetDeliveryServiceDTO) {
    let deliveryData = new DeliveryFee()
    let distancedeliveryData = new DistanceDeliveryFee()
    let neighborhood = new Neighborhood()
    let subTotal = 0

    let storeDeliveryRule = 'neighborhood'
    if(store.settings.config_local_delivery_rule) storeDeliveryRule = store.settings.config_local_delivery_rule

    if (paymentMethod === 'stone' && deliveryMode === 'store_pickup') {
      deliveryData.feePrice = 0
      deliveryData.neighborhood = address.neighborhood
      return deliveryData
    }

    if (deliveryMode === 'store_pickup') {
      return null
    }

    const paymentLink = await PaymentLinkRepository.repo(tenant).findById(paymentLinkId)
    const freeFromShipping = store.settings['config_correios_free_from']

    if (deliveryMode === 'delivery_company' && address && shipping) {
      deliveryData.feePrice = shipping ? Number(shipping.custom_price) : 0
      deliveryData.freeFrom = freeFromShipping ? Number(freeFromShipping) : 0
      deliveryData.deliveryTime = shipping ? shipping.delivery_time : 0
      deliveryData.minimumPurchase = 0
      neighborhood = address.neighborhood ? address.neighborhood : null
      deliveryData.neighborhood = neighborhood

      return deliveryData
    }


    const storeCoordinates: Coordinate = {
      latitude: store.settings.config_address_latitude ?? 0,
      longitude: store.settings.config_address_longitude ?? 0,
    }
    const customerCoordinates: Coordinate = {
      latitude: address.latitude ?? 0,
      longitude: address.longitude ?? 0,
    }


    if(address){
      if(storeDeliveryRule === 'distance'){
          distancedeliveryData = await deliveryGetFeeByDistanceService.getDeliveryFeeByDistance(
               {tenant, storeCoordinates , customerCoordinates}
            )

        if(distancedeliveryData){
          const feePrice = distancedeliveryData.feePrice
          const freeFrom = distancedeliveryData.freeFrom

          products.forEach((_product) => {
            const { amount, promotionalPrice, unitaryValue } = _product
            const price = promotionalPrice < unitaryValue ? promotionalPrice : unitaryValue

            subTotal += amount * price
          })

          distancedeliveryData.feePrice = paymentLink?.deliveryFee !== undefined ? paymentLink.deliveryFee : freeFrom > 0 && subTotal >= freeFrom ? 0 : feePrice
          return distancedeliveryData
        }
      }

      if(address.neighborhood){
        const neighborhoodId = address.neighborhood._id.toString()
        deliveryData = await deliveryGetFeeByNeighborhoodIdService.getDeliveryFeeByNeighborhoodId({ tenant, neighborhoodId })

        const feePrice = deliveryData.feePrice
        const freeFrom = deliveryData.freeFrom

        products.forEach((_product) => {
          const { amount, promotionalPrice, unitaryValue } = _product
          const price = promotionalPrice < unitaryValue ? promotionalPrice : unitaryValue

          subTotal += amount * price
        })

        deliveryData.feePrice = paymentLink?.deliveryFee !== undefined ? paymentLink.deliveryFee : freeFrom > 0 && subTotal >= freeFrom ? 0 : feePrice
        return deliveryData
      }

    }

    return null
  }
}

export default DeliveryGetService
