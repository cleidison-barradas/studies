import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../contexts/auth.context'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'
import PaymentMethod from '../../interfaces/paymentMethod'
import { CreateOnDeliveryOrder } from '../../services/order/order.service'

interface Props {
  selectedPayment: PaymentMethod
}

interface OnDeliveryCardFormData {
  comment: string
}

export const OnDeliveryCardForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender } = useContext(AuthContext)
  const navigate = useNavigate()
  const { authorization, getCartValue } = useCart()
  const { showMessage } = useAlert()
  const { total } = getCartValue()
  const { cart } = useContext(CartContext)
  const { checkoutAddress, deliveryMode, paymentCode, selectedBranchPickup } =
    useContext(CheckoutContext)

  const authorizationId = authorization?._id

  const onSubmit = async ({ comment = '' }: OnDeliveryCardFormData) => {
    const addressId = checkoutAddress?._id
    const paymentId = selectedPayment ? selectedPayment._id : null
    const cartId = cart ? cart._id : null

    if (cartId && paymentId) {
      const response = await CreateOnDeliveryOrder({
        cartId,
        sender,
        comment,
        addressId,
        paymentId,
        paymentCode,
        deliveryMode,
        storeBranchPickup: selectedBranchPickup,
        authorizationId
      })
      if (response.data && response.data.order) {
        const { order } = response.data

        navigate(`/pedido/${order._id}`)
      } else {
        showMessage((response.data as any).message, 'error')
      }
    } else {
      window.location.reload()
    }
  }

  const initialValues: OnDeliveryCardFormData = {
    comment: ''
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Typography mb={3} fontSize={20}>
            {selectedPayment?.paymentOption.name} (Maquininha)
          </Typography>
          <Typography mt={2}>Tem alguma observação? (Ex: Entregar após 18h) </Typography>
          <Field
            as={TextField}
            name="comment"
            helperText="Não é obrigatório preencher esse campo"
            fullWidth
            multiline
            rows={3}
          />
          <Stack mt={3} direction="row" justifyContent={'space-between'}>
            <Typography>Total do Pedido: R$ {total.toFixed(2)}</Typography>
          </Stack>
          <Box mt={2}>
            <Button
              variant="contained"
              type="submit"
              style={{ padding: 8, textTransform: 'none', fontWeight: 400, fontSize: 16 }}
              fullWidth
              color="secondary"
            >
              {isSubmitting ? <CircularProgress size={'16px'} /> : 'Concluir pedido'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
