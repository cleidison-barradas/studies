import { useCallback, useContext } from 'react'

import CheckoutContext from '../contexts/checkout.context'
import CartContext from '../contexts/cart.context'

import { getCupomDiscount as getDiscountFromCupom } from '../helpers/getCupomDiscount'

import Product from '../interfaces/product'

import { saveCart } from '../services/cart/cart.service'
import { useDelivery } from './useDelivery'
import { useAuth } from './useAuth'
import { ProductAuthorized } from '../interfaces/pbmAuthorization'
import { lowestProductValue } from '../helpers/lowestProductValue'
import AuthContext from '../contexts/auth.context'
import { getDistanceDeliveryRegions } from '../services/delivery/delivery.service'
import useSWR from 'swr'
import { getAddresDistanceDeliveryFee } from '../helpers/getAddresDistanceDeliveryFee'
import { CartProduct } from '../interfaces/cart'
import { getOriginPath } from '../helpers/getOriginPath'

export function useCart() {
  const { user } = useAuth()
  const { useFetchDelivery } = useDelivery()
  const { checkoutAddress, deliveryMode, shipping } = useContext(CheckoutContext)
  const {
    cart,
    fromPaymentLink,
    paymentLinkDeliveryFee,
    authorization,
    setCart,
    setNotify,
    setAuthorization,
  } = useContext(CartContext)
  const { store } = useContext(AuthContext)
  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'

  const { data: neighborhoodDeliveryAvaiable } = useFetchDelivery(true)
  const { data: distanceDeliveryRegions } = useSWR(
    'distanceDeliveryRegions',
    getDistanceDeliveryRegions
  )

  const addProduct = (
    product: Product,
    quantity: number = 1,
    notifyText: string = 'Adicionado à cesta'
  ) => {
    const exists = getProduct(product._id)

    if (!exists) {
      const products = cart.products
      const origin = getOriginPath()

      products.push({
        origin,
        product,
        quantity,
      })

      setCart((prevCart) => {
        prevCart.products = products

        if (user || cart.fingerprint) {
          saveCart(prevCart, user?.customer_id, cart.fingerprint).then((response) => {
            return { cart: response?.cart }
          })
        }

        return { ...prevCart }
      })

      setNotify({ open: true, text: notifyText })

      return
    }

    return updateProduct(product, quantity)
  }

  const getProduct = (_id: string) => {
    return cart.products.find((_product) => _product.product._id.includes(_id))
  }

  const removeProduct = (_id: Product['_id']) => {
    const products = cart.products.filter((_product) => !_product.product._id.includes(_id))

    setCart((prevCart) => {
      prevCart.products = products

      if (user || cart.fingerprint) {
        saveCart(prevCart, user?.customer_id, cart.fingerprint).then((response) => {
          return { cart: response?.cart }
        })
      }

      return { ...prevCart }
    })

    if (!products.find((p) => p.product._id.includes(_id))) {
      setNotify({ open: true, text: 'Produto removido da cesta' })
    }
  }

  const updateProduct = (product: Product, quantity: number) => {
    const products = cart.products
    const index = products.findIndex((_product) => _product.product._id.includes(product._id))
    products[index].quantity = quantity !== undefined ? quantity : products[index].quantity + 1

    setCart((prevCart) => {
      prevCart.products = products

      if (user || cart.fingerprint) {
        saveCart(prevCart, user?.customer_id, cart.fingerprint).then((response) => {
          return { cart: response?.cart }
        })
      }

      return { ...prevCart }
    })
  }

  const getDeliveryRegion = useCallback(() => {
    return neighborhoodDeliveryAvaiable.find(
      (_region) => _region.neighborhood._id === checkoutAddress?.neighborhood._id
    )
  }, [checkoutAddress, neighborhoodDeliveryAvaiable])

  const getCupomDiscount = useCallback(
    (product: Product, pbmProduct?: ProductAuthorized) => {
      if (!cart.cupom) return undefined
      return getDiscountFromCupom(product, cart.cupom, fromPaymentLink, pbmProduct)
    },
    [cart.cupom, fromPaymentLink]
  )

  const getDeliveries = useCallback(() => {
    if (checkoutAddress) {
      if (localDeliveryRule === 'distance' && distanceDeliveryRegions) {
        const customerLocation = {
          latitude: checkoutAddress.latitude || 0,
          longitude: checkoutAddress.longitude || 0,
        }
        const deliveryFee = getAddresDistanceDeliveryFee(
          distanceDeliveryRegions,
          store,
          customerLocation
        )
        return deliveryFee
      }
      const { neighborhood } = checkoutAddress
      if (!neighborhood._id) return null
      return neighborhoodDeliveryAvaiable.find((_region) =>
        _region.neighborhood._id?.includes(neighborhood._id as string)
      )
    }
    if (localDeliveryRule === 'distance' && distanceDeliveryRegions) return distanceDeliveryRegions.regions
    return neighborhoodDeliveryAvaiable
  }, [
    neighborhoodDeliveryAvaiable,
    checkoutAddress,
    distanceDeliveryRegions,
    localDeliveryRule,
    store,
  ])

  const getAuthorizedProduct = useCallback(
    (ean: string) => {
      return authorization?.productAuthorized.find((_product) => _product.ean === ean)
    },
    [authorization?.productAuthorized]
  )

  const getPmbProducts = useCallback(() => {
    return authorization?.productAuthorized
  }, [authorization?.productAuthorized])

  const getCartEansAuthorized = useCallback(() => {
    const cartEans = cart.products.map((cartProduct) => cartProduct.product.EAN) || []
    const authorizedEans =
      authorization?.productAuthorized.map((productAuthorized) => productAuthorized.ean) || []

    return cartEans.filter((ean) => authorizedEans.includes(ean))
  }, [cart.products, authorization])

  const getCartValue = useCallback(
    (saved: CartProduct[] = []) => {
      const values: Record<string, number> = {
        total: 0,
        subTotal: 0,
        discount: 0,
        freeFrom: 0,
        deliveryFee: 0,
        minimumPurchase: 0,
      };

      (saved.length === 0 ? cart.products : saved).forEach((cartProduct) => {
        const { product, quantity } = cartProduct
        const authorizedProduct = getAuthorizedProduct(product.EAN)

        const cupomDiscount = getCupomDiscount(product, authorizedProduct)

        const promotional = lowestProductValue({ product, authorizedProduct })

        if (!fromPaymentLink) {
          if (promotional && cupomDiscount) {
            if (promotional < cupomDiscount) {
              values.discount += product.price * quantity - quantity * promotional
            } else {
              values.discount += product.price * quantity - quantity * cupomDiscount
            }
          }

          if (promotional && !cupomDiscount) {
            values.discount += product.price * quantity - quantity * promotional
          }

          if (!promotional && cupomDiscount) {
            values.discount += product.price * quantity - quantity * cupomDiscount
          }
        }

        if (cupomDiscount && fromPaymentLink) {
          values.discount = product.price * quantity - quantity * cupomDiscount
        }

        values.subTotal += quantity * product.price
      })

      switch (deliveryMode) {
        case 'delivery_company':
          values.deliveryFee = shipping ? Number(shipping.price) : 0
          break

        case 'store_pickup':
          values.deliveryFee = 0
          break

        default:
          const delivery = getDeliveries()
          if (paymentLinkDeliveryFee !== undefined) {
            values.deliveryFee = paymentLinkDeliveryFee
          } else if (delivery instanceof Array && delivery.length > 0) {
            const { feePrice } = delivery[0]
            const orderByMinimumPurchase = delivery.sort(
              (a, b) => a.minimumPurchase - b.minimumPurchase
            )
            const { minimumPurchase } = orderByMinimumPurchase[0]

            const orderByFreeFrom = delivery.sort((a, b) => a.freeFrom - b.freeFrom)

            const { freeFrom } = orderByFreeFrom[0]

            values.freeFrom = freeFrom
            values.minimumPurchase =
              minimumPurchase > 0 && Number(values.subTotal - values.discount) >= minimumPurchase
                ? 0
                : minimumPurchase
            values.deliveryFee =
              freeFrom > 0 && Number(values.subTotal - values.discount) >= freeFrom ? 0 : feePrice
          } else {
            if (!Array.isArray(delivery) && delivery) {
              const { feePrice, freeFrom, minimumPurchase } = delivery

              values.freeFrom = freeFrom
              values.minimumPurchase =
                minimumPurchase > 0 && Number(values.subTotal - values.discount) >= minimumPurchase
                  ? 0
                  : minimumPurchase
              values.deliveryFee =
                freeFrom > 0 && Number(values.subTotal - values.discount) >= freeFrom ? 0 : feePrice
            }
          }
      }

      values.total = values.subTotal - values.discount + values.deliveryFee
      return values
    }, [
    shipping,
    deliveryMode,
    cart.products,
    fromPaymentLink,
    paymentLinkDeliveryFee,
    getDeliveries,
    getCupomDiscount,
    getAuthorizedProduct
  ])

  const getProductsQuantity = () => {
    return cart.products.length
  }

  const getCartFingerPrint = () => {
    if (!cart) return null

    const fingerprint = cart.fingerprint

    return fingerprint
  }

  return {
    authorization,
    fromPaymentLink,
    getProduct,
    addProduct,
    getCartValue,
    removeProduct,
    updateProduct,
    getDeliveries,
    getCupomDiscount,
    getDeliveryRegion,
    getProductsQuantity,
    getCartFingerPrint,
    getPmbProducts,
    setAuthorization,
    getAuthorizedProduct,
    getCartEansAuthorized,
  }
}
