import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { SelectButton } from '../../components/SelectButton'
import AuthContext from '../../contexts/auth.context'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'
import PaymentMethod from '../../interfaces/paymentMethod'
import { CreateMoneyOrder } from '../../services/order/order.service'

interface Props {
  selectedPayment: PaymentMethod
}

interface MoneyFormData {
  moneyChange: number
  comment: string
}

export const MoneyForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender } = useContext(AuthContext)
  const navigate = useNavigate()
  const { checkoutAddress, deliveryMode, paymentCode, selectedBranchPickup, onFinishOrder } =
    useContext(CheckoutContext)
  const { authorization, getCartValue } = useCart()
  const { cart } = useContext(CartContext)
  const { showMessage } = useAlert()
  const { total } = getCartValue()

  const authorizationId = authorization?._id

  const onSubmit = async (data: MoneyFormData) => {
    const paymentId = selectedPayment ? selectedPayment._id : null
    const cartId = cart && cart._id ? cart._id : null
    const addressId = checkoutAddress?._id
    const installedApp = isUsingInstalled()

    if (cartId && paymentId) {
      const response = await CreateMoneyOrder({
        cartId: cartId!,
        sender,
        addressId,
        paymentId: paymentId!,
        paymentCode,
        deliveryMode,
        installedApp,
        storeBranchPickup: selectedBranchPickup,
        authorizationId,
        ...data
      })

      if (response.data && response.data.order) {
        const { order } = response.data

        navigate(`/pedido/${order._id}`)

        await onFinishOrder(order)
      } else {
        showMessage((response.data as any).message, 'error')
      }
    } else {
      window.location.reload()
    }
  }

  const initialValues: MoneyFormData = {
    moneyChange: 0,
    comment: '',
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <Typography mb={3} fontSize={20}>
            Dinheiro
          </Typography>
          <Typography mb={3}>Precisa de troco?</Typography>
          <Stack mb={3} direction="row" spacing={2}>
            <SelectButton
              selected={values.moneyChange !== 0}
              onClick={() => setFieldValue('moneyChange', 1)}
            >
              Sim
            </SelectButton>
            <SelectButton
              selected={values.moneyChange === 0}
              onClick={() => setFieldValue('moneyChange', 0)}
            >
              Não
            </SelectButton>
          </Stack>
          {values.moneyChange !== 0 && (
            <React.Fragment>
              <Typography mb={1}>Troco para quanto?</Typography>
              <Field
                as={TextField}
                name="moneyChange"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>R$</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </React.Fragment>
          )}
          <Typography mt={2}> Tem alguma observação? (Ex: Entregar após 18h) </Typography>
          <Field
            as={TextField}
            name="comment"
            helperText="Não é obrigatório preencher esse campo"
            fullWidth
            multiline
            rows={3}
          />
          <Stack mt={3} direction="row" justifyContent={'space-between'}>
            <Typography>Total do Pedido: {floatToBRL(total)}</Typography>
          </Stack>
          <Box mt={1}>
            <Button
              variant="contained"
              type="submit"
              style={{ padding: 8, fontWeight: 400, fontSize: 16 }}
              fullWidth
              disabled={isSubmitting}
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
