import { Stack, Typography, Button } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Address from '../../interfaces/address'
import AuthContext from '../../contexts/auth.context'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { SelectButton } from '../SelectButton'
import { CheckoutAddressList } from '../CheckoutAddressList'
import { getAddresses } from '../../services/address/address.service'
import { CheckoutAddressContainer } from '../CheckoutAddressContainer'
import { useDelivery } from '../../hooks/useDelivery'
import { getPaymentMethods } from '../../services/payment/payment.service'
import { WhatsappButton } from '../Faq/styles'
import { WhatsappIcon } from '../../assets/icons'
import { getBranchesPickup } from '../../services/branchPickup/branchPickup.service'
import { StoreBranchPickupList } from '../StorePickupBranchList'
import { useCart } from '../../hooks/useCart'
import { postCustomerPreAuthorization } from '../../services/epharma/epharma.service'
import DeliveryTo from './DeliveryTo'

interface DeliveryCheckoutContainerProps {
  onFinish: (value: number) => void
}

export const DeliveryCheckoutContainer: React.FC<DeliveryCheckoutContainerProps> = ({
  onFinish,
}) => {
  const { user, store } = useContext(AuthContext)
  const { cart } = useContext(CartContext)

  const { data: paymentOptionsRequest } = useSWR('paymentMethods', getPaymentMethods)
  const { data } = useSWR(`addresses/${user?._id}`, getAddresses)
  const { hasLocalDelivery } = useDelivery()
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const {
    checkoutAddress,
    deliveryMode,
    shipping,
    selectedBranchPickup,
    setGoToPayment,
    setCheckoutAddress,
    setDeliveryMode,
    setShipping,
    setSelectedBranchPickup,
  } = useContext(CheckoutContext)
  const { data: storeBranchesPickup } = useSWR(`branchesPickup`, getBranchesPickup)
  const { authorization, getCartEansAuthorized, setAuthorization } = useCart()

  useEffect(() => {
    getPaymentMethods()
  }, [user])

  const virtualProducts = cart.products.filter(({ product }) => product.updateOrigin === 'Docas')
  const hasVirtualProducts = virtualProducts.length > 0
  const isAllVirtualProducts = virtualProducts.length === cart.products.length
  const hasAvailablePayments = paymentOptionsRequest
    ? paymentOptionsRequest.paymentMethods.length > 0
    : false
  const pickupInStoreActive = store ? store.settings.config_pickup_in_store : false
  const storeWhatsApp = store ? store.settings.config_whatsapp_phone?.replace(/[^0-9]/g, '') : null

  const eans = getCartEansAuthorized()

  const onSelectAddress = (address: Address | null) => {
    setSelectedAddress(address)
  }

  const onOwnDelivery = () => {
    setDeliveryMode('own_delivery')
  }

  const onStorePickup = () => {
    setDeliveryMode('store_pickup')
    if (storeBranchesPickup && storeBranchesPickup.branchesPickup.length === 0) onFinish(2)
  }

  const handleEditAddress = () => {
    setShipping(null)
    setCheckoutAddress(null)
  }

  const hasStorePickupPayments = paymentOptionsRequest?.paymentMethods.find((value) => {
    // online pickup payment methods
    return (
      ((value.paymentOption.type === 'gateway' || value.paymentOption.type === 'ticket') &&
        !(
          value.paymentOption.name.toLowerCase() === 'pagseguro' ||
          value.paymentOption.name.toLowerCase() === 'stone' ||
          value.paymentOption.type === 'ticket'
        )) ||
      // local pickup methods
      (!hasVirtualProducts &&
        (value.paymentOption.type === 'credit' ||
          value.paymentOption.type === 'money' ||
          value.paymentOption.type === 'covenant'))
    )
  })

  const handleRefreshPreAuthorization = useCallback(async () => {
    if (eans.length > 0 && authorization) {
      const response = await postCustomerPreAuthorization({
        eans,
        fingerprint: authorization.fingerprint,
        prescriptor: authorization.prescriptor,
        elegibilityToken: authorization.elegibilityToken,
      })

      if (response) {
        const { error } = response

        if (!error) {
          setAuthorization(response.authorization)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAuthorization])

  const handleAddress = useCallback(() => {

    setGoToPayment(false)

    if (deliveryMode === 'will_decide') {
      const addresses = data ? data.addresses : []
      const mainAddress = addresses?.find((_address) => _address.isMain)

      if (mainAddress && !checkoutAddress && !selectedAddress) {
        setCheckoutAddress(mainAddress)
        setSelectedAddress(mainAddress)

        if (hasVirtualProducts && deliveryMode !== 'will_decide') onFinish(2)

        setDeliveryMode('own_delivery')
      }
    }

    if (deliveryMode === 'own_delivery' && checkoutAddress) {
      if (!!hasLocalDelivery(checkoutAddress)) setGoToPayment(true)
    }

    if (deliveryMode === 'delivery_company' && shipping) {
      setGoToPayment(true)
    }
  }, [
    data,
    selectedAddress,
    checkoutAddress,
    deliveryMode,
    onFinish,
    shipping,
    setGoToPayment,
    hasVirtualProducts,
    setDeliveryMode,
    hasLocalDelivery,
    setCheckoutAddress,
  ])

  useEffect(() => {
    handleRefreshPreAuthorization()
  }, [handleRefreshPreAuthorization])

  useEffect(() => {
    handleAddress()
  }, [handleAddress])

  const onCreateAddress = async () => {
    const res = await mutate(`addresses/${user?._id}`)
    setIsEditingAddress(false)
    if (res.addresses) {
      const mainAddress = res.addresses.find((value: Address) => value.isMain)
      setCheckoutAddress(mainAddress)
      setSelectedAddress(mainAddress)
    }
  }

  return (
    <Stack flex={1}>
      {!hasAvailablePayments ? (
        <React.Fragment>
          <Typography fontSize={20}>Opções não disponíveis no momento</Typography>
          <Stack
            direction="row"
            spacing={2}
            mb={2}
            mt={2}
            justifyContent="space-between"
            marginBottom={{
              xs: '24px',
              md: '24px',
            }}
          >
            <Button fullWidth color="primary" href={store?.url} variant="contained">
              Voltar
            </Button>
            {storeWhatsApp && (
              <WhatsappButton
                rel="noopener noreferrer"
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=55${storeWhatsApp}&text=Olá, vim pelo site!`}
              >
                Fale conosco <WhatsappIcon style={{ height: 26 }} />
              </WhatsappButton>
            )}
          </Stack>
        </React.Fragment>
      ) : isEditingAddress ? (
        <CheckoutAddressContainer
          onReturn={() => setIsEditingAddress(false)}
          onFinish={onCreateAddress}
        />
      ) : (
        <React.Fragment>
          {pickupInStoreActive && !hasVirtualProducts && (
            <React.Fragment>
              <Typography fontSize={20}>Selecione como prefere receber seu pedido</Typography>
              <Stack
                mt={2}
                spacing={2}
                direction="row"
                justifyContent="space-between"
                marginBottom={{
                  xs: '24px',
                  md:
                    !deliveryMode.includes('store_pickup') ||
                    (storeBranchesPickup && storeBranchesPickup.branchesPickup.length > 0)
                      ? '24px'
                      : '200px',
                }}
              >
                <SelectButton
                  selected={deliveryMode.includes('own_delivery')}
                  onClick={onOwnDelivery}
                >
                  Entrega
                </SelectButton>

                {hasStorePickupPayments && (
                  <SelectButton
                    onClick={onStorePickup}
                    selected={deliveryMode.includes('store_pickup')}
                  >
                    Retirar
                  </SelectButton>
                )}
              </Stack>
            </React.Fragment>
          )}

          {deliveryMode.includes('store_pickup') &&
            storeBranchesPickup &&
            storeBranchesPickup.branchesPickup.length > 0 && (
              <StoreBranchPickupList
                onSelect={setSelectedBranchPickup}
                selectedStoreBranch={selectedBranchPickup}
                branchesPickup={storeBranchesPickup?.branchesPickup}
              />
            )}

          {data?.addresses.length === 0 && !deliveryMode.includes('store_pickup') && (
            <CheckoutAddressContainer
              onReturn={() => setIsEditingAddress(false)}
              onFinish={async () => {
                await mutate(`addresses/${user?._id}`)
                setIsEditingAddress(false)
              }}
              shouldHideReturn
            />
          )}
          {!deliveryMode.includes('store_pickup') &&
            !checkoutAddress &&
            data?.addresses.length !== 0 && (
              <Stack spacing={2}>
                <CheckoutAddressList selected={selectedAddress} onSelect={onSelectAddress} />
                <Button fullWidth onClick={() => setIsEditingAddress(true)}>
                  Cadastre um endereço
                </Button>
                <Button
                  fullWidth
                  onClick={() => setCheckoutAddress(selectedAddress)}
                  disabled={!selectedAddress}
                  color="secondary"
                  variant="contained"
                >
                  Continuar
                </Button>
              </Stack>
            )}

          {!deliveryMode.includes('store_pickup') && checkoutAddress && (
            <DeliveryTo
              checkoutAddress={checkoutAddress}
              setShipping={setShipping}
              setCheckoutAddress={setCheckoutAddress}
              setDeliveryMode={setDeliveryMode}
              hasVirtualProducts={hasVirtualProducts}
              isAllVirtualProducts={isAllVirtualProducts}
              onFinish={onFinish}
              handleEditAddress={handleEditAddress}
            />
          )}

          {deliveryMode.includes('store_pickup') && (
            <Button
              color="secondary"
              onClick={() => {
                onFinish(2)
              }}
              disabled={
                deliveryMode.includes('will_decide') ||
                (deliveryMode.includes('store_pickup') && !selectedBranchPickup)
              }
              variant="contained"
            >
              Continuar
            </Button>
          )}
        </React.Fragment>
      )}
    </Stack>
  )
}