import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Button, CircularProgress, Link, Stack, TextField, Typography, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router'
import io from 'socket.io-client'
import * as yup from 'yup'

import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'

import { CreatePixOrder } from '../../services/order/order.service'

import CheckoutContext from '../../contexts/checkout.context'
import CartContext from '../../contexts/cart.context'
import AuthContext from '../../contexts/auth.context'

import { PixPayInfo } from '../../components/PixPayInfo'
import { MaskedInput } from '../../components/MaskedInput'

import Order from '../../interfaces/order'
import PaymentMethod from '../../interfaces/paymentMethod'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'

import { validateCPF } from '../../helpers/cpfHelper'
import { floatToBRL } from '../../helpers/moneyFormat'

interface Props {
  selectedPayment: PaymentMethod
}

interface PixFormData {
  comment: string
  cpf: string
}

const { REACT_APP_WEBHOOK_API } = process.env

export const PixForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender, user } = useContext(AuthContext)
  const [order, setOrder] = useState<Order | undefined>()
  const {
    checkoutAddress,
    deliveryMode,
    paymentCode,
    shipping,
    selectedBranchPickup,
    onFinishOrder,
  } = useContext(CheckoutContext)
  const { cart, authorization } = useContext(CartContext)
  const { showMessage } = useAlert()
  const [fetching, setFetching] = useState(false)
  const installedApp = isUsingInstalled()

  const { getCartValue } = useCart()

  const navigate = useNavigate()

  const cpf = user && user.cpf ? user.cpf : ''
  const authorizationId = authorization?._id

  const onSubmit = useCallback(
    async (data: PixFormData) => {
      const addressId = checkoutAddress ? checkoutAddress._id : undefined
      const cartId = cart ? cart._id : null
      const paymentId = selectedPayment ? selectedPayment._id : null

      if (cartId && paymentId) {
        setFetching(true)
        const response = await CreatePixOrder({
          cartId,
          sender,
          shipping,
          addressId,
          paymentId,
          paymentCode,
          deliveryMode,
          installedApp,
          storeBranchPickup: selectedBranchPickup,
          authorizationId,
          ...data
        })

        if (response.data && response.data.order) {
          setOrder(response.data.order)

        } else {
          showMessage('Falha ao gerar pagamento', 'error')
        }
        setFetching(false)
      }
    },
    [
      cart,
      checkoutAddress,
      deliveryMode,
      paymentCode,
      shipping,
      sender,
      selectedPayment,
      authorizationId,
      installedApp,
      selectedBranchPickup,
      setOrder,
      showMessage
    ]
  )

  const initialValues: PixFormData = {
    cpf,
    comment: '',
  }

  const validationSchema = yup.object().shape({
    comment: yup.string(),
    cpf: yup.string().test({
      name: 'is-valid-cpf',
      test(value, ctx) {
        const document = value?.replace(/\D+/g, '')

        if (document && document.length > 0) {
          if (validateCPF(document)) return true
        }

        return ctx.createError({ message: 'CPF inválido' })
      },
    }),
  })

  // pix order status callback
  useEffect(() => {
    if (order) {
      const socket = io(REACT_APP_WEBHOOK_API!, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
      })

      socket.emit('newOrder', order?._id)

      socket.on('status', async () => {
        navigate(`/pedido/${order!._id}`)
        await onFinishOrder(order!)
      })
    }
  }, [navigate, order, onFinishOrder])

  return (
    <React.Fragment>
      {fetching ? (
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <CircularProgress size={50} color="primary" />
          <Typography fontSize={18}>Gerando cobrança aguarde...</Typography>
        </Stack>
      ) : !fetching && order ? (
        <React.Fragment>
          <PixPayInfo code={order.extras[0].qrcode} qrcodeSrc={order.extras[0].imagemQrcode} />
          <Box mt={2}>
            <Typography>
              Já fez o pagamento e ainda não foi redirecionado ao pedido?
              <Link
                ml={1}
                onClick={async () => {
                  await onFinishOrder(order)
                }}
                component={RouterLink}
                to={`/pedido/${order._id}`}
              >
                Clique aqui
              </Link>
            </Typography>
          </Box>
        </React.Fragment>
      ) : (
        <Formik
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          initialValues={initialValues}
        >
          {({ isValid, isSubmitting, values, errors }) => (
            <Form>
              <Typography mb={2} fontSize={20}>
                Pix
              </Typography>
              <Stack spacing={2}>
                <Field
                  name="cpf"
                  fullWidth
                  as={MaskedInput}
                  value={values.cpf}
                  error={!!errors.cpf}
                  mask="999.999.999-99"
                  helperText={errors.cpf}
                />
                <div>
                  <Typography mt={2}> Tem alguma observação? (Ex: Entregar após 18h) </Typography>
                  <Field
                    as={TextField}
                    name="comment"
                    helperText="Não é obrigatório preencher esse campo"
                    fullWidth
                    multiline
                    rows={3}
                  />
                </div>
                <Stack mt={3} direction="row" justifyContent={'space-between'}>
                  <Typography>Total do Pedido: {floatToBRL(getCartValue().total)}</Typography>
                </Stack>
                <Button
                  variant="contained"
                  style={{ padding: 8, textTransform: 'none', fontWeight: 400, fontSize: 16 }}
                  fullWidth
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  endIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                  color="secondary"
                >
                  {isSubmitting ? 'Aguarde, gerando cobrança' : 'Gerar chave PIX'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      )}
    </React.Fragment>
  )
}
