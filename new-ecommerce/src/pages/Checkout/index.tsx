import { useNavigate } from 'react-router'
import { Hidden, Stack, Box } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  DeliveryCheckoutContainer,
  PaymentCheckoutContainer,
} from '../../components/CheckoutContainer'
import { CheckoutDrawer } from '../../components/CheckoutDrawer'
import { CheckoutStepper } from '../../components/CheckoutStepper'
import { FooterCheckout } from '../../components/FooterCheckout'
import { HeaderCheckout } from '../../components/HeaderCheckout'
import DeliveryInsufucientCartItems from '../../components/DeliveryInsufucientCartItems'
import { OrderDetail } from '../../components/OrderDetail'
import { CheckoutLoginForm } from '../../forms/CheckoutLoginForm'
import { CompleteCheckout } from '../../components/CompleteCheckout'
import { Container, PageContainer } from './styles'
import AuthContext from '../../contexts/auth.context'
import {
  CheckoutConsumer,
  CheckoutContextData,
  CheckoutProvider,
} from '../../contexts/checkout.context'

const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const [completeCheckout, setComplete] = useState(false)
  const { user } = useContext(AuthContext)
  const [step, setStep] = useState(0)

  const missingFields = user
    ? user.telephone.length <= 0 || user.firstname.length <= 0 || user.lastname.length <= 0
    : false

  useEffect(() => {
    if (missingFields) {
      setComplete(true)
    }
  }, [missingFields])

  const stepToForm: Record<number, React.ReactNode> = {
    0: <CheckoutLoginForm onFinish={() => setStep(1)} />,
    1: <DeliveryCheckoutContainer onFinish={setStep} />,
    2: <PaymentCheckoutContainer />,
  }

  const handleSelectAddress = ({
    setOpenModalMinimumPurchase,
    setShipping,
    setCheckoutAddress,
  }: CheckoutContextData) => {
    setOpenModalMinimumPurchase(false)
    setStep(1)
    setShipping(null)
    setCheckoutAddress(null)
  }

  return (
    <CheckoutProvider>
      <CheckoutConsumer>
        {(checkout) => (
          <>
            <PageContainer>
              <HeaderCheckout />
              <Container>
                <Hidden mdUp>
                  <CheckoutDrawer step={step} />
                </Hidden>
                <Stack direction={{ md: 'column', lg: 'row' }} gap={3}>
                  <Box flex={{ xs: 'normal', lg: 1 }} width="100%">
                    <CheckoutStepper onClickStep={(value) => setStep(value)} step={step} />
                    <Stack direction="row" spacing={2} p={{ xs: 2, md: 4 }}>
                      {completeCheckout ? (
                        <CompleteCheckout onUpdate={() => setComplete(false)} />
                      ) : (
                        stepToForm[step]
                      )}
                      <Hidden smDown lgUp>
                        <OrderDetail step={step} />
                      </Hidden>
                    </Stack>
                  </Box>
                  <Hidden lgDown>
                    <div>
                      <OrderDetail step={step} />
                    </div>
                  </Hidden>
                </Stack>
              </Container>
              <FooterCheckout />
            </PageContainer>

            <DeliveryInsufucientCartItems
              openModal={checkout.openModalMinimumPurchase}
              onSelectAddress={() => handleSelectAddress(checkout)}
              onSelectProducts={() => navigate('/products')}
            />
          </>
        )}
      </CheckoutConsumer>
    </CheckoutProvider>
  )
}

export default Checkout
