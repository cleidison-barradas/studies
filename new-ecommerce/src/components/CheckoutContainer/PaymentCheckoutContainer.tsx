/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, Typography } from '@mui/material'
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { SelectButton } from '../SelectButton'
// Interfaces
import PaymentMethod from '../../interfaces/paymentMethod'

import { CheckoutModal } from '../CheckoutModal'
// Forms
import { PixForm } from '../../forms/PixForm'
import { MoneyForm } from '../../forms/MoneyForm'
import { PicpayForm } from '../../forms/PicpayForm'
import { BoletoForm } from '../../forms/BoletoForm'
import { CovenantForm } from '../../forms/CovenantForm'
import { PagseguroForm } from '../../forms/PagseguroForm'
import { StoneCardForm } from '../../forms/StoneCardForm'
import { OnDeliveryCardForm } from '../../forms/OnDeliveryCardForm'
import { CompleteCheckoutform } from '../../forms/CompleteCheckoutForm'

import AuthContext from '../../contexts/auth.context'
import CheckoutContext from '../../contexts/checkout.context'

import { CardIcon, HandShakeIcon, MoneyIcon, PicpayIcon, PixIcon } from '../../assets/icons'

import { OnlinePaymentOptions } from '../OnlinePaymentOptions'
import { OnDeliveryPaymentOptions } from '../OnDeliveryPaymentOptions'
import { getPaymentMethods } from '../../services/payment/payment.service'
import CartContext from '../../contexts/cart.context'
import { useCart } from '../../hooks/useCart'

const paymentOptionIcon: Record<string, React.ReactNode> = {
  pix: <PixIcon height={20} width={20} color={'inherit'} />,
  picpay: <PicpayIcon height={24} width={24} color={'inherit'} />,
  pagseguro: <CardIcon height={24} width={24} color={'inherit'} />,
  stone: <CardIcon height={24} width={24} color={'inherit'} />,
}

const paymentTypeIcon: Record<string, React.ReactNode> = {
  credit: <CardIcon height={24} width={24} color={'inherit'} />,
  debit: <CardIcon height={24} width={24} color={'inherit'} />,
  money: <MoneyIcon height={24} width={24} color={'inherit'} />,
  covenant: <HandShakeIcon height={24} width={24} color={'inherit'} />,
}

interface Props {
  onlineTypes?: string[]
  pickupTypes?: string[]
  localTypes?: string[]
  onlinePickupMethods?: string[]
}

export const PaymentCheckoutContainer: React.FC<Props> = ({
  onlineTypes = ['gateway', 'ticket'],
  pickupTypes = ['stone', 'ticket'],
  localTypes = ['money', 'credit', 'debit', 'covenant'],
  onlinePickupMethods = ['pix', 'picpay', 'stone'],
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const {
    checkoutAddress,
    deliveryMode,
    setOpenModalMinimumPurchase,
    paymentCode,
    setPaymentCode,
  } = useContext(CheckoutContext)
  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)
  const { user, store } = useContext(AuthContext)
  const { getCartValue } = useCart()
  const { subTotal, minimumPurchase, discount } = getCartValue()
  const { cart } = useContext(CartContext)
  const [missingFields, setMissingFiedls] = useState(false)
  const missingCustomerCPF = user
    ? (deliveryMode.includes('delivery_company') && !user.cpf) ||
      (store && store.settings.config_cpf_checkout && !user.cpf)
    : false

  const paymentMethods = paymentOptionsRequest ? paymentOptionsRequest.paymentMethods : []

  const hasVirtualProducts = cart.products.find(({ product }) => product.updateOrigin === 'Docas')

  const handleInsuficientCartItens = useCallback(() => {
    if (minimumPurchase > 0 && Number(subTotal - discount) <= minimumPurchase) {
      setOpenModalMinimumPurchase(true)
    } else {
      setOpenModalMinimumPurchase(false)
    }
  }, [subTotal, discount, minimumPurchase])

  const SelectedPaymentForm = () => {
    if (selectedPayment) {
      const { type, name } = selectedPayment.paymentOption

      type ListPayments = {
        [key: string]: {
          method?: ReactNode
          [key: string]: ReactNode
        }
      }

      const payments: ListPayments = {
        gateway: {
          pix: <PixForm selectedPayment={selectedPayment} />,
          stone: <StoneCardForm selectedPayment={selectedPayment} />,
          picpay: <PicpayForm selectedPayment={selectedPayment} />,
          pagseguro: <PagseguroForm selectedPayment={selectedPayment} />,
        },
        ticket: {
          boleto: <BoletoForm selectedPayment={selectedPayment} />,
        },
        credit: {
          method: <OnDeliveryCardForm selectedPayment={selectedPayment} />,
        },
        debit: {
          method: <OnDeliveryCardForm selectedPayment={selectedPayment} />,
        },
        covenant: {
          method: <CovenantForm selectedPayment={selectedPayment} />,
        },
        money: {
          method: <MoneyForm selectedPayment={selectedPayment} />,
        },
      }

      return <>{payments[type][name?.toLowerCase()] || payments[type]?.method}</>
    }

    return <React.Fragment />
  }

  const onlineAvailableOptions =
    paymentMethods.length > 0
      ? paymentMethods.filter((method) => {
          const { paymentOption } = method
          if (deliveryMode.includes('store_pickup'))
            return onlinePickupMethods.includes(paymentOption.name.toLowerCase())

          return onlineTypes.includes(paymentOption.type)
        }).length > 0
      : false

  const onlineAvailablePickupOptions =
    paymentMethods.length > 0
      ? paymentMethods.filter(
          (method) =>
            !pickupTypes.includes(method.paymentOption.name.toLowerCase()) ||
            !pickupTypes.includes(method.paymentOption.type)
        ).length > 0
      : false

  const localAvailableOptions = () => {
    if (!!hasVirtualProducts) return false

    return paymentMethods.length > 0
      ? paymentMethods.filter((method) => localTypes.includes(method.paymentOption.type)).length > 0
      : false
  }

  useEffect(() => {
    handleInsuficientCartItens()
  }, [handleInsuficientCartItens])

  useEffect(() => {
    if (!onlineAvailableOptions && paymentCode === 'pay_online') {
      setPaymentCode('pay_on_delivery')
    }
  }, [onlineAvailableOptions, paymentCode, setPaymentCode])

  useEffect(() => {
    if (missingCustomerCPF) {
      setMissingFiedls(true)
    }
  }, [missingCustomerCPF, deliveryMode])

  return (
    <React.Fragment>
      {missingFields ? (
        <Box flex={1}>
          <CompleteCheckoutform user={user} cpfRequired onFinish={() => setMissingFiedls(false)} />
        </Box>
      ) : (
        <Box flex={1}>
          <Typography fontSize={20}>Métodos de Pagamento</Typography>

          {deliveryMode !== 'delivery_company' && onlineAvailableOptions && !hasVirtualProducts && (
            <Stack mt={2} direction="row" justifyContent="space-between" spacing={2}>
              {(deliveryMode === 'store_pickup' && onlineAvailablePickupOptions) ||
              deliveryMode === 'own_delivery' ? (
                <SelectButton
                  selected={paymentCode.includes('pay_online')}
                  onClick={() => setPaymentCode('pay_online')}
                >
                  Pagar online
                </SelectButton>
              ) : (
                setPaymentCode('pay_on_delivery')
              )}
              {localAvailableOptions() && (
                <SelectButton
                  selected={paymentCode.includes('pay_on_delivery')}
                  onClick={() => setPaymentCode('pay_on_delivery')}
                >
                  {checkoutAddress ? 'Na entrega' : 'Na loja'}
                </SelectButton>
              )}
            </Stack>
          )}
          <Typography mt={3} fontSize={14}>
            Selecione uma opção de pagamento
          </Typography>
          {(hasVirtualProducts ? true : paymentCode.includes('pay_online')) ? (
            <OnlinePaymentOptions
              user={user}
              deliveryMode={deliveryMode}
              hasVirtualProducts={!!hasVirtualProducts}
              setSelectedPayment={setSelectedPayment}
            />
          ) : (
            !hasVirtualProducts && (
              <OnDeliveryPaymentOptions
                deliveryMode={deliveryMode}
                setSelectedPayment={setSelectedPayment}
              />
            )
          )}
          {selectedPayment && (
            <CheckoutModal
              icon={
                paymentOptionIcon[selectedPayment.paymentOption.name.toLowerCase()]
                  ? paymentOptionIcon[selectedPayment.paymentOption.name.toLowerCase()]
                  : paymentTypeIcon[selectedPayment.paymentOption.type.toLowerCase()]
              }
              open={!!selectedPayment}
              onClose={() => setSelectedPayment(null)}
            >
              <SelectedPaymentForm />
            </CheckoutModal>
          )}
        </Box>
      )}
    </React.Fragment>
  )
}
