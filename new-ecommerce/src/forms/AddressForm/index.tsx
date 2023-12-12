import { Button, CircularProgress } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useContext } from 'react'
import { saveAddress } from '../../services/address/address.service'
import Address from '../../interfaces/address'
import { AddressFormFields } from './fields'
import Neighborhood from '../../interfaces/neighborhood'
import { useDelivery } from '../../hooks/useDelivery'
import AuthContext from '../../contexts/auth.context'
import { normalizeStr } from '../../helpers/normalizeString'
import { AddressValidator, AddressValidatorRequiredCep } from '../validators/AddressValidators'
import * as yup from 'yup'

interface AddressFormProps {
  onFinish?: () => void
  address?: Address
  buttonColor?: 'primary' | 'secondary'
}

export const AddressForm: React.FC<AddressFormProps> = ({ onFinish, address, buttonColor }) => {
  const { store } = useContext(AuthContext)
  const { hasShippingAvailable, citys } = useDelivery()
  const defaultCity = citys.find(value => normalizeStr(value._id).toLowerCase() === normalizeStr(store?.settings.config_store_city?.toLowerCase() || ''))
  const localDeliveryRule = store?.settings.config_local_delivery_rule || 'neighborhood'

  const initialValues = address || {
    postcode: '',
    number: '',
    street: '',
    complement: '',
    neighborhood: {
      _id: '',
      name: '',
      city: {
        name: defaultCity?._id || '',
        state: {
          name: defaultCity?.deliveryFees[0].neighborhood.city.state.name || '',
        },
      },
    },
    isMain: true,
  }

  const handleSubmit = async (values: any) => {
    const response = await saveAddress({
      id: values._id,
      postcode: values.postcode || '',
      number: values.number || '',
      street: values.street || '',
      complement: values.complement,
      neighborhood: values.neighborhood as Neighborhood,
      isMain: values.isMain || true,
    })

    if (onFinish && response.ok) onFinish()
  }

  const formValidator = yup.object(
    (hasShippingAvailable || localDeliveryRule === 'distance') ? AddressValidatorRequiredCep : AddressValidator
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={formValidator}
      enableReinitialize
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          { <AddressFormFields /> }
          <Button
            fullWidth
            variant="contained"
            disabled={!isValid || isSubmitting || !dirty}
            type="submit"
            color={buttonColor}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Continuar'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
