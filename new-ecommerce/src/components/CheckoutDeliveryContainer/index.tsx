/* eslint-disable react-hooks/exhaustive-deps */
import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import useSWR from 'swr'
import AuthContext from '../../contexts/auth.context'
import CheckoutContext from '../../contexts/checkout.context'
import { renderDeliveryTimeText } from '../../helpers/CheckInterval'
import { useCart } from '../../hooks/useCart'
import { useDelivery } from '../../hooks/useDelivery'
import { IShipping } from '../../interfaces/shipping'
import { getDeliverySchedule } from '../../services/delivery/delivery.service'
import { getPaymentMethods } from '../../services/payment/payment.service'
import { isDistanceDeliveryFee } from '../../interfaces/distanceDeliveryFee'
import ErrorMessage from './ErrorMessage'
import { DeliveryOption } from '../DeliveryOption'

interface CheckoutDeliveryContainerProps {
  editingAddress: () => void
  isAllVirtualProducts?: boolean
  hasVirtulProducts?: boolean
  onFinish: () => void
}

export const CheckoutDeliveryContainer: React.FC<CheckoutDeliveryContainerProps> = ({
  onFinish,
  isAllVirtualProducts,
  hasVirtulProducts,
  editingAddress,
}) => {
  const { sender } = useContext(AuthContext)
  const { checkoutAddress, deliveryMode, setOpenModalMinimumPurchase, shipping, goToPayment, setShipping, setDeliveryMode } =
    useContext(CheckoutContext)
  const { hasLocalDelivery, citys, shippingData } = useDelivery()
  const { getCartValue } = useCart()
  const { subTotal, minimumPurchase, discount } = getCartValue()
  const deliveryRegion = hasLocalDelivery(checkoutAddress)
  const navigate = useNavigate()
  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)

  const feePrice = deliveryRegion?.feePrice || 0
  const freeFrom = deliveryRegion?.freeFrom || 0
  const deliveryFee = freeFrom > 0 && Number(subTotal - discount) >= freeFrom ? 0 : feePrice
  const { data: deliveryScheduleRequest } = useSWR('deliverySchedule', getDeliverySchedule, {
    revalidateOnFocus: false,
  })

  const timeTextDeliveryLocal = renderDeliveryTimeText({
    schedules: deliveryScheduleRequest?.data?.schedule,
    region: deliveryRegion,
  })

  const shippingOptions = useMemo(() => (shippingData ? shippingData.shipping : []), [shippingData])

  const selectDelivery = useCallback(() => {
    setDeliveryMode('own_delivery')
    setShipping(null)
  }, [setDeliveryMode, setShipping])

  const selectShipping = useCallback(
    (value: IShipping) => {
      setDeliveryMode('delivery_company')
      setShipping(value)
    },
    [setDeliveryMode, setShipping]
  )

  const handleDefaultShipping = useCallback(() => {
    if (deliveryMode === 'will_decide') {
      const cheaper = shippingOptions
        .filter((opt) => !opt.error)
        .sort((a, b) => a.price - b.price)
        .shift()

      if (cheaper && !hasVirtulProducts) {
        selectShipping(cheaper)
        setDeliveryMode('delivery_company')
      }
    }
  }, [deliveryMode, hasVirtulProducts, shippingOptions, selectShipping, setDeliveryMode])

  const handleInsuficientCartItens = useCallback(() => {
    if (minimumPurchase > 0 && Number(subTotal - discount) <= minimumPurchase) {
      setOpenModalMinimumPurchase(true)
    } else {
      setOpenModalMinimumPurchase(false)
    }
  }, [subTotal, discount, minimumPurchase])

  const hasOnlinePaymentOptions = !!paymentOptionsRequest?.paymentMethods.find(
    (value) => value.paymentOption.type === 'gateway' || value.paymentOption.type === 'ticket'
  )

  useEffect(() => {
    handleInsuficientCartItens()
    handleDefaultShipping()
  }, [handleInsuficientCartItens, handleDefaultShipping])

  const isValidShipping =
    (!deliveryRegion && sender.includes('not_selected')) ||
    (!deliveryRegion && shippingData && !shippingData.shipping.find((opt) => !opt.error))

  const isVisibleMessageError = hasVirtulProducts ? !deliveryRegion : isValidShipping

  if (isVisibleMessageError) {
    return (
      <Stack pt={1} width="100%" spacing={4} justifyContent="center" alignItems="center">
        {shippingData && <ErrorMessage shipping={shippingData?.shipping} />}
        {citys.length > 0 && (
          <>
            <Stack spacing={1}>
              <Typography fontSize={20} textAlign="center">
                Não possuimos entrega para o endereço selecionado
              </Typography>
              <Typography fontSize={16} textAlign="center">
                Atualmente entregamos nas seguintes cidades :
              </Typography>
              <Typography textAlign="center">
                {citys
                  .map(
                    (value) =>
                      `${value._id} - ${value.deliveryFees[0].neighborhood.city.state.code}`
                  )
                  .join(', ')}
              </Typography>
            </Stack>
          </>
        )}
        <Button
          variant="contained"
          onClick={() => navigate(`/user/address/new`)}
          fullWidth
          color="secondary"
        >
          Cadastrar novo endereço
        </Button>
      </Stack>
    )
  }

  const isDeliveryCompany = checkoutAddress && checkoutAddress.postcode && hasOnlinePaymentOptions

  const isValidDeliveryCompany = hasVirtulProducts ? false : !!isDeliveryCompany

  const deliveryTime =
    parseInt(((deliveryRegion?.deliveryTime || 0) / 60 + 120).toString(), 10) + ' horas'

  return (
    <React.Fragment>
      {deliveryRegion && (
        <DeliveryOption
          selected={deliveryMode === 'own_delivery'}
          onClick={selectDelivery}
          title={`Delivery local`}
          description={
            isDistanceDeliveryFee(deliveryRegion) ?
              `Entrega para até ${deliveryRegion.distance / 1000}Km de distância da loja`
              :
              `Toda região de ${checkoutAddress!.neighborhood.name}, ${checkoutAddress?.neighborhood.city.name
              }`
          }
          time={hasVirtulProducts ? deliveryTime : timeTextDeliveryLocal}
          price={deliveryFee}
        />
      )}
      {isValidDeliveryCompany && (
        <>
          {shippingData ? (
            shippingOptions
              .filter((opt) => !opt.error)
              .sort((a, b) => Number(a.custom_price) - Number(b.custom_price))
              .map((option) => (
                <DeliveryOption
                  key={option.id}
                  onClick={() => selectShipping(option)}
                  selected={shipping?.id === option.id && deliveryMode.includes('delivery_company')}
                  title={`${option.company.name} ${option.name}`}
                  description={option.company.name}
                  time={`${
                    hasVirtulProducts
                      ? option.custom_delivery_range.min + 3
                      : option.custom_delivery_range.min
                  } a ${
                    hasVirtulProducts
                      ? option.custom_delivery_range.max + 5
                      : option.custom_delivery_range.max
                  } dias`}
                  price={Number(option.custom_price)}
                />
              ))
          ) : (
            <Typography
              m={2}
              display="flex"
              sx={{ gap: 1 }}
              justifyContent="center"
              alignItems="center"
              fontSize={20}
            >
              Carregando entregas por transportadora <CircularProgress size={20} />
            </Typography>
          )}
        </>
      )}

      <Button
        disabled={!goToPayment || deliveryMode.includes('will_decide')}
        color="secondary"
        onClick={onFinish}
        variant="contained"
      >
        Continuar
      </Button>
    </React.Fragment>
  )
}
