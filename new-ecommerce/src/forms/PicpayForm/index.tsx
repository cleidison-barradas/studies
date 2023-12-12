import { Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { CreatePicpayOrder, GetOrders } from '../../services/order/order.service'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PicpayInfo } from '../../components/PicpayInfo'
import { useAlert } from '../../hooks/useAlert'
import Order from '../../interfaces/order'
import PaymentMethod from '../../interfaces/paymentMethod'
import AuthContext from '../../contexts/auth.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'

interface Props {
  selectedPayment: PaymentMethod
}

interface PicpayFormData {
  comment: ''
}

export const PicpayForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const [order, setOrder] = useState<Order | undefined>()
  const {
    checkoutAddress,
    deliveryMode,
    shipping,
    paymentCode,
    selectedBranchPickup,
    onFinishOrder,
  } = useContext(CheckoutContext)
  const { cart, authorization } = useContext(CartContext)
  const { sender } = useContext(AuthContext)
  const installedApp = isUsingInstalled()
  const { showMessage } = useAlert()
  const navigate = useNavigate()

  const initialValues: PicpayFormData = { comment: '' }
  const authorizationId = authorization?._id

  const onSubmit = async (data: PicpayFormData) => {
    const addressId = checkoutAddress?._id
    const paymentId = selectedPayment ? selectedPayment._id : null
    const cartId = cart ? cart._id : null
    const { comment = '' } = data

    if (cartId && paymentId) {
      const response = await CreatePicpayOrder({
        cartId,
        sender,
        comment,
        shipping,
        addressId,
        paymentId,
        paymentCode,
        installedApp,
        deliveryMode,
        storeBranchPickup: selectedBranchPickup,
        authorizationId
      })

      if (response.data && response.data) {
        if (response.data.error) {
          return showMessage('ocorreu um erro inesperado!', 'error')
        }

        setOrder(response.data.order)
      }
    } else {
      window.location.reload()
    }
  }

  const checkOrderStatus = useCallback(async () => {
    const response = await GetOrders(order?._id)

    if (response && response.order) {
      const { statusOrder } = response.order

      if (statusOrder.type.includes('payment_made')) {
        navigate(`/pedido/${response.order._id}`)
        await onFinishOrder(response.order)
      }
    }
  }, [order, navigate, onFinishOrder])

  useEffect(() => {
    if (order) {
      const timer = setInterval(async () => await checkOrderStatus(), 1000 * 2)
      return () => clearInterval(timer)
    }
  }, [order, checkOrderStatus])

  return order ? (
    <Stack spacing={1}>
      <PicpayInfo qrCodeSrc={order.extras[0].qrcode.base64} url={order.extras[0].paymentUrl} />

      <Box>
        <Typography textAlign="center" fontSize={12}>
          Após o pagamento ser efetuado, você será redirecionado para a pagina do seu pedido.
        </Typography>
        <Typography textAlign="center" fontSize={12}>
          Caso não seja redirecionado, aguarde até 1 minuto, ou
          <Link
            onClick={() => onFinishOrder(order)}
            component={RouterLink}
            pr={1}
            to={`/pedido/${order._id}`}
            pl={1}
          >
            clique aqui
          </Link>
          para ser redirecionado
        </Typography>
      </Box>
    </Stack>
  ) : (
    <React.Fragment>
      <React.Fragment>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Typography mb={3} fontSize={20}>
                Pague com PicPay direto do seu celular
              </Typography>
              <Typography mb={4} fontSize={14}>
                Ao finalizar a compra, um código será exibido. Para pagar basta escanear o código
                com seu PicPay.
              </Typography>
              <Typography mb={2} fontSize={14}>
                Ainda não tem conta?
              </Typography>
              <Typography mb={4} fontSize={14}>
                Baixe o aplicativo gratuitamente na Play Store ou na Apple Store.
              </Typography>
              <Typography> Tem alguma observação? (Ex: Entregar após 18h) </Typography>
              <Stack spacing={2}>
                <Field
                  as={TextField}
                  name="comment"
                  helperText="Não é obrigatório preencher esse campo"
                  fullWidth
                  multiline
                  rows={3}
                />
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={isSubmitting && <CircularProgress size={20} />}
                  color="secondary"
                >
                  {isSubmitting ? 'Gerando link de pagamento' : 'Pagar com PicPay'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    </React.Fragment>
  )
}
