import React, { useCallback, useContext, useEffect } from 'react'
import { CardForm, Installment } from '../CardForm'
import {
  CreateCardToken,
  GetCardBrand,
  GetInstallments,
  GetPagseguroHash,
  PagseguroSession,
} from '../../services/pagseguro/pagseguro.service'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { useCart } from '../../hooks/useCart'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { CreatePagseguroOrder } from '../../services/order/order.service'
import { useNavigate } from 'react-router'
import { useAlert } from '../../hooks/useAlert'
import PaymentMethod from '../../interfaces/paymentMethod'
import AuthContext from '../../contexts/auth.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'
import { validateCPF } from '../../helpers/cpfHelper'

const validationSchema = yup.object({
  number: yup.string().required(),
  name: yup.string().required(),
  cvc: yup.string().required(),
  expiry: yup.string().required(),
  cpf: yup.string().test({
    name: 'is-valid-cpf',
    test(value, ctx) {
      const cpf = value?.replace(/\D+/g, '')

      if (cpf && cpf.length > 0) {
        if (validateCPF(cpf)) return true
      }

      return ctx.createError({ message: 'CPF inválido' })
    },
  }),
})

interface Props {
  selectedPayment: PaymentMethod
}

interface PagseguroFormData {
  cpf: string
  cvc: string
  name: string
  number: string
  expiry: string
  comment: string
  installments: any[]
  selectedInstallment: any
}

export const PagseguroForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender, user } = useContext(AuthContext)
  const { authorization, getCartValue } = useCart()
  const { checkoutAddress, deliveryMode, paymentCode, shipping, onFinishOrder } =
    useContext(CheckoutContext)
  const { cart } = useContext(CartContext)
  const { showMessage } = useAlert()
  const navigate = useNavigate()
  const installedApp = isUsingInstalled()

  const cpf = user && user.cpf ? user.cpf : ''
  const authorizationId = authorization?._id

  const loadAndSession = useCallback(async () => {
    if (selectedPayment && selectedPayment._id) {
      await (window as any).loadPagSeguro()

      const response = await PagseguroSession(selectedPayment._id)

      if (response.data) {
        (window as any)._PagSeguroDirectPayment.setSessionId(response.data.session)
      } else {
        showMessage('Falha ao fazer sessão com o pagseguro', 'error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment])

  useEffect(() => {
    loadAndSession()
  }, [loadAndSession])

  const onSubmit = async (requestOrder: PagseguroFormData) => {
    const addressId = checkoutAddress ? checkoutAddress._id : null
    const paymentId = selectedPayment ? selectedPayment._id : null
    const cartId = cart ? cart._id : null

    try {
      if (cartId && addressId && paymentId) {
        const sender_hash = await GetPagseguroHash()
        const cardBrand = await GetCardBrand(requestOrder.number)

        const card_token = await CreateCardToken({
          cardBrand,
          cardCVC: requestOrder.cvc,
          cardExpire: requestOrder.expiry,
          cardNumber: requestOrder.number,
        })

        const response = await CreatePagseguroOrder({
          cartId,
          sender,
          shipping,
          addressId,
          paymentId,
          card_token,
          sender_hash,
          paymentCode,
          deliveryMode,
          installedApp,
          authorizationId,
          cpf: requestOrder.cpf,
          card_name: requestOrder.name,
          comment: requestOrder.comment,
          installment: {
            amount: requestOrder.selectedInstallment.value,
            quantity: requestOrder.selectedInstallment.quantity,
            noInterestInstallmentQuantity: requestOrder.selectedInstallment.hasFee,
          },
        })

        if (response && response.data) {
          const { data } = response

          if (data.error) {
            return showMessage(data.error, 'error')
          }

          const isVirtual = !!data.order.virtualOrderId
          navigate(`/pedido/${data.order._id}${isVirtual ? '?v=1' : ''}`)

          await onFinishOrder(data.order)
        }
      } else {
        window.location.reload()
      }
    } catch (error) {
      showMessage(`ocorreu um erro inesperado: ${error}`, 'error')
    }
  }

  const getInstallments = async (cardNumber: string) => {
    const brand = (await GetCardBrand(cardNumber)) as any

    if (brand) {
      const { total } = getCartValue()

      const installments = await GetInstallments({
        amount: total,
        brand: brand.brand.name,
      })

      if (installments) {
        return installments.map(
          (value: any): Installment => ({
            value: value.installmentAmount,
            quantity: value.quantity,
            total: value.totalAmount,
            hasFee: !value.interestFree,
          })
        )
      }
    }
  }

  const initialValues: PagseguroFormData = {
    cpf,
    cvc: '',
    name: '',
    expiry: '',
    number: '',
    comment: '',
    installments: [],
    selectedInstallment: { quantity: 1 },
  }

  return (
    <React.Fragment>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
        {({ values }) => (
          <Form>
            <CardForm getInstallments={() => getInstallments(values.number)} />
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}
