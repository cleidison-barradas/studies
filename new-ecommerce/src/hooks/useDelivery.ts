import { useContext } from 'react'
import useSWR from 'swr'
import AuthContext from '../contexts/auth.context'
import CartContext from '../contexts/cart.context'
import CheckoutContext from '../contexts/checkout.context'
import { waypointContext } from '../contexts/waypoint.context'
import { getAddresDistanceDeliveryFee } from '../helpers/getAddresDistanceDeliveryFee'
import { getExpensiveRegion } from '../helpers/getExpensiveRegion'
import Address from '../interfaces/address'
import { getAddresses } from '../services/address/address.service'
import {
  getDeliveryRegions,
  getDistanceDeliveryRegions,
  getRegions,
} from '../services/delivery/delivery.service'
import { calculateShipping, parseProductsToShipping } from '../services/shipping/shipping.service'

export const useDelivery = () => {
  const { cart } = useContext(CartContext)
  const { store, user, sender } = useContext(AuthContext)
  const { checkoutAddress } = useContext(CheckoutContext)
  const { shouldRenderOptionals } = useContext(waypointContext)

  const { data: addressData } = useSWR(user ? `addresses/${user._id}` : null, getAddresses)
  const { data: cities } = useSWR(
    shouldRenderOptionals ? 'deliveryRegions' : null,
    getDeliveryRegions
  )
  const { data: regionsData = [] } = useFetchDelivery(shouldRenderOptionals)
  const { data: distanceDeliveryRegions } = useSWR(
    'distanceDeliveryRegions',
    getDistanceDeliveryRegions
  )

  const { data: shippingData } = useFetchShipping(checkoutAddress, !sender.includes('not_selected'))

  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'

  const hasShippingAvailable =
    store?.settings.config_shipping_courier || store?.settings.config_best_shipping

  function getMainAddress(address: Address | Address[] | null) {
    if (address instanceof Array) {
      return address.find((_address) => _address.isMain)
    }
    return address
  }

  function useFetchDelivery(shouldFetch: boolean) {
    const address = getMainAddress(checkoutAddress || addressData?.addresses || null)

    const { data = [], error } = useSWR(shouldFetch ? 'regions' : null, async () => {
      const response = await getRegions(address?.neighborhood._id || '')

      return response?.regions
    })

    return { data, error }
  }

  function useFetchShipping(_checkoutAddress: Address | null, senderOrigin: boolean = false) {
    const zipcode =
      _checkoutAddress && senderOrigin && _checkoutAddress.postcode
        ? _checkoutAddress.postcode
        : undefined
    const productsIds = cart.products.map((product) => product.product._id).join(',')
    const { data, error } = useSWR(
      zipcode ? `shipping/${zipcode}/${productsIds}` : null,
      async () => {
        const response = await calculateShipping({
          zipcode,
          sender,
          products: parseProductsToShipping(cart.products),
        })

        return response?.shipping
      }
    )

    return { data, error }
  }

  const hasLocalDelivery = (address: Address | null) => {
    if (localDeliveryRule === 'distance' && distanceDeliveryRegions && address) {
      const customerLocation = {
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
      }

      const deliveryFee = getAddresDistanceDeliveryFee(
        distanceDeliveryRegions,
        store,
        customerLocation
      )
      if (!Array.isArray(deliveryFee) && deliveryFee) return deliveryFee
      else return null
    }

    if (!address || !address.neighborhood._id) return null

    return regionsData.find((region) =>
      region.neighborhood._id?.includes(address.neighborhood._id as string)
    )
  }

  return {
    shippingData,
    hasLocalDelivery,
    useFetchDelivery,
    hasShippingAvailable,
    neighborhoods: regionsData,
    citys: cities?.regions || [],
    getExpensiveRegion: () => getExpensiveRegion({ regions: cities?.regions || [] }),
  }
}
