import { Form, Formik, FormikHelpers } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CartContext from '../../contexts/cart.context'
import CheckoutContext from '../../contexts/checkout.context'
import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'
import { CreateStoneCardOrder } from '../../services/order/order.service'
import { getStoneToken } from '../../services/stone/stone.service'
import { CardForm, Installment } from '../CardForm'
import * as yup from 'yup'
import PaymentMethod from '../../interfaces/paymentMethod'
import AuthContext from '../../contexts/auth.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'
import { validateCPF } from '../../helpers/cpfHelper'
import { AddressValidatorRequiredCep } from '../validators/AddressValidators'
import Address from '../../interfaces/address'

interface Props {
  selectedPayment: PaymentMethod
}

interface StoneCardFormData {
  cpf: string
  cvc: string
  name: string
  number: string
  expiry: string
  comment: string
  installments: Installment[]
  selectedInstallment: Installment
  address?: {
    ismain: boolean
    complement: string
    postcode: string
    number: string
    street: string
    neighborhood: {
      name: string
      city: {
        name: string
        state: {
          name: string
          code: string
        }
      }
    }
  }
}

const baseYupValidation = {
  number: yup.string().required(),
  name: yup.string().required(),
  cvc: yup.string().required(),
  expiry: yup.string().required(),
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
}

export const StoneCardForm: React.FC<Props> = ({ selectedPayment = null }) => {
  const { sender, user } = useContext(AuthContext)
  const { getCartValue } = useCart()
  const {
    checkoutAddress,
    deliveryMode,
    paymentCode,
    shipping,
    onFinishOrder,
    selectedBranchPickup,
  } = useContext(CheckoutContext)
  const [cardHolderAddress, setCardHolderAddress] = useState<Address | null>(checkoutAddress)
  const { cart, authorization } = useContext(CartContext)
  const { showMessage } = useAlert()
  const navigate = useNavigate()
  const installedApp = isUsingInstalled()
  const [registerNewAddress, setRegisterNewAddress] = useState(false)
  const formikRef = React.useRef(null)
  const [validationSchema, setValidationSchema] = useState<any>(baseYupValidation)

  const cpf = user && user.cpf ? user.cpf : ''
  const authorizationId = authorization?._id

  useEffect(() => {
    setValidationSchema(
      deliveryMode.includes('store_pickup') && registerNewAddress
        ? {
            ...baseYupValidation,
            address: yup.object(AddressValidatorRequiredCep),
          }
        : baseYupValidation
    )

    setTimeout(() => {
      if (formikRef.current) (formikRef.current as FormikHelpers<StoneCardFormData>).validateForm()
    }, 200)
  }, [registerNewAddress, deliveryMode])

  const initialValues: StoneCardFormData = {
    cpf,
    cvc: '',
    name: '',
    number: '',
    expiry: '',
    comment: '',
    installments: [],
    selectedInstallment: {
      quantity: 1,
      hasFee: false,
      total: getCartValue().total,
      value: getCartValue().total,
    },
    address: {
      ismain: false,
      postcode: '',
      number: '',
      street: '',
      complement: '',
      neighborhood: {
        name: '',
        city: {
          name: '',
          state: {
            code: '',
            name: '',
          },
        },
      },
    },
  }

  const getInstallments = async () => {
    const totalOrder = getCartValue().total

    const maxInstallments = selectedPayment?.installmentsDetails?.maxInstallments ?? 12

    return [...new Array(maxInstallments)].map(
      (_, index): Installment => ({
        quantity: index + 1,
        total: totalOrder,
        hasFee: false,
        value: totalOrder / (index + 1),
      })
    )
  }

  const onSubmit = async (data: StoneCardFormData) => {
    const { expiry, number, name, cvc, comment, cpf: document, address } = data
    const addressId = cardHolderAddress ? cardHolderAddress._id : null
    const paymentId = selectedPayment ? selectedPayment._id : null
    const cartId = cart ? cart._id : null

    if (cartId && (addressId !== null || address) && paymentId) {
      const cardToken = await getStoneToken({ cvv: cvc, number, name, expireDate: expiry }).catch(
        (err) => {
          showMessage(err.message, 'error')
        }
      )

      if (!cardToken) return

      const response = await CreateStoneCardOrder({
        cpf: document,
        address,
        cartId,
        sender,
        comment,
        shipping,
        addressId,
        paymentId,
        paymentCode,
        deliveryMode,
        installedApp,
        card_token: cardToken,
        authorizationId,
        installments: {
          quantity: data.selectedInstallment.quantity,
        },
        storeBranchPickup: selectedBranchPickup,
      })

      if (response.data && response.data.order) {
        const order = response.data.order
        const isVirtual = order?.relatedOrderId

        const orderId = order._id?.toString()

        navigate(`/pedido/${isVirtual ? order.relatedOrderId : orderId}${isVirtual ? '?v=1' : ''}`)
        await onFinishOrder(response.data.order)
      } else {
        if (response.data?.error)
          showMessage(
            ' Transação não aprovada. Verifique com seu banco e tente novamente.',
            'error'
          )
        else showMessage(response.data?.error || 'Contate o administrador do site', 'error')
      }
    } else {
      showMessage('carrinho inválido', 'error')
      window.location.reload()
    }
  }

  return (
    <Formik
      validationSchema={yup.object(validationSchema)}
      initialValues={initialValues}
      onSubmit={onSubmit}
      innerRef={formikRef}
    >
      <Form>
        <CardForm
          getInstallments={getInstallments}
          setRegisterNewAddress={setRegisterNewAddress}
          registerNewAddress={registerNewAddress}
          cardHolderAddress={cardHolderAddress}
          setCardHolderAddress={setCardHolderAddress}
        />
      </Form>
    </Formik>
  )
}
