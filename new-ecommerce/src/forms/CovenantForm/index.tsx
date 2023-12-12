import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { Field, Form, Formik } from 'formik'
import { Button, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material'
import PaymentMethod from '../../interfaces/paymentMethod'
import SelectFormField from '../../components/SelectFormField'
import { CreateOnDeliveryOrder } from '../../services/order/order.service'
import AuthContext from '../../contexts/auth.context'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'
import { floatToBRL } from '../../helpers/moneyFormat'
import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'

interface CovenantFormData {
  comment: string
  payment_installments: number
  healthInsurance: string
}

interface Props {
  selectedPayment: PaymentMethod
}

export const CovenantForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender } = useContext(AuthContext)
  const { authorization, getCartValue, getDeliveryRegion } = useCart()
  const navigate = useNavigate()
  const { checkoutAddress, deliveryMode, paymentCode, selectedBranchPickup, onFinishOrder } =
    useContext(CheckoutContext)
  const { cart } = useContext(CartContext)
  const { showMessage } = useAlert()

  const authorizationId = authorization?._id
  const maxInstallments = selectedPayment?.details?.payment_maxInstallments ? selectedPayment.details.payment_maxInstallments : 1

  const onSubmit = async ({ comment, healthInsurance, payment_installments }: CovenantFormData) => {
    const paymentId = selectedPayment ? selectedPayment._id : null
    const addressId = checkoutAddress?._id
    const cartId = cart ? cart._id : null
    const installedApp = isUsingInstalled()

    if (cartId && paymentId) {
      const response = await CreateOnDeliveryOrder({
        cartId,
        sender,
        comment,
        addressId,
        paymentId,
        paymentCode,
        deliveryMode,
        healthInsurance,
        payment_installments,
        installedApp,
        storeBranchPickup: selectedBranchPickup,
        authorizationId,
      })

      if (response.data && response.data.order) {
        const { order } = response.data

        navigate(`/pedido/${order._id}`)
        await onFinishOrder(order)
      } else showMessage((response.data as any).message, 'error')
    } else {
      window.location.reload()
    }
  }

  const initialValues: CovenantFormData = {
    comment: '',
    payment_installments: 1,
    healthInsurance: '',
  }

  const { total } = getCartValue()
  const deliveryFee = getDeliveryRegion()

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues}>
      {({ isSubmitting, values }) => (
        <Form>
          <Stack gap={2}>
            <Typography fontSize={20}>Pagamento por convênio</Typography>
            <Field
              as={TextField}
              name="healthInsurance"
              fullWidth
              label="Empresa"
              placeholder="Nome da empresa"
            />
            {maxInstallments > 1 && maxInstallments <= 24 ? (
              <>
                <Typography>Parcelas disponíveis</Typography>
                <Field name="payment_installments" fullWidth component={SelectFormField}>
                  {[...Array(maxInstallments)].map((_, index) => {
                    const priceByInstallment = floatToBRL(Number((total / (index + 1)).toFixed(2)))
                    const text = `em ${index + 1}x de ${priceByInstallment}`
                    return (
                      <MenuItem value={index + 1} key={index}>
                        {index === 0 ? 'A vista' : text}
                      </MenuItem>
                    )
                  })}
                </Field>
              </>
            ) : null}
            <div>
              <Typography> Tem alguma observação? (Ex: Entregar após 18h) </Typography>
              <Field
                as={TextField}
                name="comment"
                helperText="Não é obrigatório preencher esse campo"
                fullWidth
                multiline
                rows={3}
              />
            </div>
            <div>
              {values.payment_installments > 1 && values.payment_installments <= maxInstallments ? (
                <>
                  <Typography>
                    Total do Pedido: {floatToBRL(total)} em {values.payment_installments}x de{' '}
                    {floatToBRL(Number((total / values.payment_installments).toFixed(2)))}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography>Total do Pedido: {floatToBRL(total)}</Typography>
                </>
              )}
              {deliveryFee && (
                <Typography>Tempo de entrega: {deliveryFee.deliveryTime} minutos</Typography>
              )}
            </div>
            <Button
              variant="contained"
              type="submit"
              style={{ padding: 8, textTransform: 'none', fontWeight: 400, fontSize: 16 }}
              fullWidth
              color="secondary"
            >
              {isSubmitting ? <CircularProgress size={'16px'} /> : 'Concluir pedido'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
