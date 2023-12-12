import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { loadPaymentLinkByFingerprint } from '../services/paymentLink/paymentLink.service'
import { loadStorage, saveStorage } from '../services/storage/storage.service'
import { loadCartByFingerprint } from '../services/cart/cart.service'

import { PBMAuthorization } from '../interfaces/pbmAuthorization'
import Cart from '../interfaces/cart'

import { StorageKeys } from '../config/keys'
import { useAuth } from '../hooks/useAuth'
import { getPBMAuthorization } from '../services/epharma/epharma.service'

interface NotifyCartData {
  open: boolean
  text: string
}

interface CartContextData {
  cart: Cart
  open: boolean
  notify: NotifyCartData
  fromPaymentLink: boolean
  authorization: PBMAuthorization | null
  paymentLinkDeliveryFee: number | undefined
  setOpen: (open: boolean) => void
  getProceedCheckout: () => boolean
  getCartFingerPrint: () => string | null
  loadAuthorization: () => Promise<void>
  setProceedCheckout: (active: boolean) => void
  setCart: React.Dispatch<React.SetStateAction<Cart>>
  loadCart: (fromPaymentLinkLoad?: boolean) => Promise<void>
  setNotify: React.Dispatch<React.SetStateAction<NotifyCartData>>
  setAuthorization: React.Dispatch<React.SetStateAction<PBMAuthorization | null>>
}

const CartContext = createContext({} as CartContextData)
const { Provider } = CartContext

export const CartProvider: React.FC = ({ children }) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [fromPaymentLink, setFromPaymentLink] = useState(false)
  const [notify, setNotify] = useState<NotifyCartData>({ open: false, text: '' })
  const [authorization, setAuthorization] = useState<PBMAuthorization | null>(null)
  const [cart, setCart] = useState<Cart>({ cupom: null, products: [], fingerprint: null })
  const [paymentLinkDeliveryFee, setPaymentLinkDeliveryFee] = useState<number | undefined>()

  const navigate = useNavigate()

  const loadAuthorization = useCallback(async () => {

    const response = await getPBMAuthorization({ fingerprint: cart.fingerprint! })

    if (!response?.error) {

      return setAuthorization(response?.authorization!)
    }

  }, [cart.fingerprint])

  const loadCart = useCallback(
    async (fromPaymentLinkLoad: boolean = false) => {
      const linkFingerprint = searchParams.get('l') || null

      if (linkFingerprint && !fromPaymentLinkLoad) {
        setFromPaymentLink(true)

        const responseLink = await loadPaymentLinkByFingerprint(linkFingerprint)

        if (responseLink && responseLink.cart) {
          const cartLink = responseLink.cart

          if (responseLink.deliveryFee !== undefined) {
            setPaymentLinkDeliveryFee(responseLink.deliveryFee)
          }

          if (cartLink.products[0].product !== undefined) {
            return setCart({
              ...cartLink,
              products: cartLink.products.map(({ product, quantity }) => ({
                product,
                quantity: quantity as number,
              })),
            })
          }

          return setCart({
            ...cartLink,
            products: cartLink.products.map((product: any) => ({
              product,
              quantity: product.quantity,
            })),
          })
        } else if (responseLink?.message) {
          setNotify({ open: true, text: 'Link de pagamento não encontrado.' })
          return navigate('/')
        }
      }
      const storedCart = loadStorage<Cart>(StorageKeys.cart)

      const response = await loadCartByFingerprint(storedCart?.fingerprint || null, user?.customer_id)

      if (response) {
        saveStorage(StorageKeys.cart, { fingerprint: response.cart.fingerprint })

        setCart(response.cart)
      }
    },
    [user, navigate, searchParams]
  )

  useEffect(() => {
    if (notify.open === true) {
      setTimeout((value) => {
        setNotify({ ...value, open: false })
      }, 2500)
    }
  }, [notify])

  useEffect(() => {
    loadCart()
    loadAuthorization()
  }, [loadCart, loadAuthorization])

  const setProceedCheckout = (active: boolean) => {
    const value = active ? 'true' : 'false'

    localStorage.setItem('proceedCheckout', value)
  }

  const getProceedCheckout = () => {
    const value = localStorage.getItem('proceedCheckout')

    if (value === 'true') {
      return true
    }

    return false
  }

  const getCartFingerPrint = () => {
    const storedCart = loadStorage<Cart>(StorageKeys.cart)

    return storedCart?.fingerprint || null
  }

  return (
    <Provider
      value={{
        open,
        cart,
        notify,
        authorization,
        fromPaymentLink,
        paymentLinkDeliveryFee,
        setOpen,
        setCart,
        loadCart,
        setNotify,
        setAuthorization,
        loadAuthorization,
        getCartFingerPrint,
        setProceedCheckout,
        getProceedCheckout,
      }}
    >
      {children}
    </Provider>
  )
}

export default CartContext
