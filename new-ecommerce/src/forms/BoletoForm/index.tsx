import { Typography, Stack, TextField, Button, CircularProgress, Box, Link } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import React, { useCallback, useContext, useState } from 'react'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'
import Order from '../../interfaces/order'
import { createBoletoOrder } from '../../services/stone/stone.service'
import * as yup from 'yup'
import { Link as RouterLink } from 'react-router-dom'
import { BoletoInfo } from '../../components/BoletoInfo'
import PaymentMethod from '../../interfaces/paymentMethod'
import AuthContext from '../../contexts/auth.context'
import { MaskedInput } from '../../components/MaskedInput'
import { validateCPF } from '../../helpers/cpfHelper'
import { floatToBRL } from '../../helpers/moneyFormat'

interface Props {
  selectedPayment: PaymentMethod
}

interface BoletoFormData {
  comment: string
  cpf: string
}

const validationSchema = yup.object().shape({
  comment: yup.string(),
  cpf: yup.string().test({
    name: 'is-valid-cpf',
    test(value, ctx) {
      const cpf = value?.replace(/\D+/g, "")

      if (cpf && cpf.length > 0) {

        if (validateCPF(cpf)) return true
      }

      return ctx.createError({ message: 'CPF inválido' })
    }
  })
})

export const BoletoForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { cart } = useContext(CartContext)
  const { user, sender } = useContext(AuthContext)
  const { checkoutAddress, deliveryMode, paymentCode, shipping, onFinishOrder } = useContext(CheckoutContext)
  const [order, setOrder] = useState<Order | undefined>()
  const [fetching, setFetching] = useState(false)
  const { showMessage } = useAlert()
  const { authorization, getCartValue } = useCart()

  const cpf = user?.cpf || ''
  const authorizationId = authorization?._id

  const onSubmit = useCallback(
    async (data: any) => {
      const paymentId = selectedPayment ? selectedPayment._id : null
      const addressId = checkoutAddress?._id
      const cartId = cart ? cart._id : null

      if (cartId && paymentId) {
        setFetching(true)

        const response = await createBoletoOrder({
          cartId,
          sender,
          shipping,
          addressId,
          paymentId,
          paymentCode,
          deliveryMode,
          authorizationId,
          ...data,
        })

        if (response.data && !response.data.error) {

          setOrder(response.data.order)

        } else {

          showMessage('Falha ao gerar pagamento', 'error')
        }
        setFetching(false)

      } else {

        window.location.reload()
      }

    },
    [cart, sender, checkoutAddress, deliveryMode, paymentCode, shipping, selectedPayment, authorizationId, setOrder, showMessage]
  )

  const initialValues: BoletoFormData = {
    cpf,
    comment: '',
  }

  return (
    <React.Fragment>
      {fetching ? (
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <CircularProgress size={50} color="primary" />
          <Typography fontSize={18} >Gerando boleto aguarde ...</Typography>
        </Stack>
      ) : !fetching && order ? (
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <BoletoInfo
            pdfUrl={order.extras[0]}
            paycode={order.extras[3]}
            barcodeUrl={order.extras[1]}
          />
          <Box mt={2}>
            <Typography>
              Já pagou o boleto acima?
              <Link
                ml={1}
                mr={1}
                onClick={async () => {
                  await onFinishOrder(order)
                }}
                component={RouterLink}
                to={`/pedido/${order._id}`}
              >
                Clique aqui
              </Link>
              para acompanhar o pedido
            </Typography>
          </Box>
        </Stack>

      ) : (
        <Formik onSubmit={onSubmit} validationSchema={validationSchema} initialValues={initialValues}>
          {({ isValid, isSubmitting, values, errors }) => (
            <Form>
              <Typography mb={2} fontSize={20}>
                Boleto
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
                  {isSubmitting && fetching ? 'Aguarde, gerando cobrança' : 'Gerar boleto de pagamento'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      )}
    </React.Fragment>
  )
}
