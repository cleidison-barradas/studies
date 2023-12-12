import React, { createContext, useCallback, useState } from 'react'
import { useEC } from '../hooks/useEC'
import Address from '../interfaces/address'
import { DeliveryMode } from '../interfaces/deliveryMode'
import Order from '../interfaces/order'
import { IPaymentCode } from '../interfaces/paymentCode'
import { IShipping } from '../interfaces/shipping'
import { StoreBranchPickup } from '../interfaces/storeBranchPickup'

export interface CheckoutContextData {
  goToPayment: boolean
  paymentCode: IPaymentCode
  shipping: IShipping | null
  deliveryMode: DeliveryMode
  checkoutAddress: Address | null
  selectedBranchPickup: StoreBranchPickup | null
  openModalMinimumPurchase: boolean
  setOpenModalMinimumPurchase: (value: boolean) => void
  onFinishOrder: (order: Order) => void
  setGoToPayment: React.Dispatch<React.SetStateAction<boolean>>
  setPaymentCode: React.Dispatch<React.SetStateAction<IPaymentCode>>
  setShipping: React.Dispatch<React.SetStateAction<IShipping | null>>
  setDeliveryMode: React.Dispatch<React.SetStateAction<DeliveryMode>>
  setCheckoutAddress: React.Dispatch<React.SetStateAction<Address | null>>
  setSelectedBranchPickup: React.Dispatch<React.SetStateAction<StoreBranchPickup | null>>
}

const CheckoutContext = createContext({} as CheckoutContextData)
const { Provider, Consumer } = CheckoutContext

export const CheckoutConsumer = Consumer

export const CheckoutProvider: React.FC = ({ children }) => {
  const [shipping, setShipping] = useState<IShipping | null>(null)
  const [openModalMinimumPurchase, setOpenModalMinimumPurchase] = useState(false)
  const [paymentCode, setPaymentCode] = useState<IPaymentCode>('pay_online')
  const [checkoutAddress, setCheckoutAddress] = useState<Address | null>(null)
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('will_decide')
  const [selectedBranchPickup, setSelectedBranchPickup] = useState<StoreBranchPickup | null>(null)

  const [goToPayment, setGoToPayment] = useState(false)
  const { purchase } = useEC()

  const onFinishOrder = useCallback(
    (order: Order) => {
      purchase(order)
    },
    [purchase]
  )

  return (
    <Provider
      value={{
        shipping,
        paymentCode,
        goToPayment,
        deliveryMode,
        checkoutAddress,
        selectedBranchPickup,
        setShipping,
        onFinishOrder,
        setPaymentCode,
        openModalMinimumPurchase,
        setOpenModalMinimumPurchase,
        setGoToPayment,
        setDeliveryMode,
        setCheckoutAddress,
        setSelectedBranchPickup,
      }}
    >
      {children}
    </Provider>
  )
}

export default CheckoutContext
