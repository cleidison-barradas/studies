import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from 'styled-components'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import 'react-credit-cards/es/styles-compiled.css'
import { Field, useFormikContext } from 'formik'
import { CardFormFields } from './fields'
import { ArrowBackIos } from '@mui/icons-material'
import SslSeal from '../../assets/ilustration/seals/sslseal.png'
import SecurePayment from '../../assets/ilustration/seals/securepayment.png'
import Satisfaction from '../../assets/ilustration/seals/satisfaction.png'
import { SealWrapper } from './styles'
import AuthContext from '../../contexts/auth.context'
import { getAddresses } from '../../services/address/address.service'
import useSWR from 'swr'
import CheckoutContext from '../../contexts/checkout.context'
import { AddressCard } from '../../components/AddressCard'
import { AddressFormFields } from '../AddressForm/fields'
import Address from '../../interfaces/address'

export interface Installment {
  value: number
  total: number
  quantity: number
  hasFee: boolean
}

interface CardFormProps {
  getInstallments?: () => Promise<Installment[]>
  registerNewAddress?: boolean
  setRegisterNewAddress?: (isEditing: boolean) => void
  cardHolderAddress?: Address | null
  setCardHolderAddress?: (address: Address | null) => void
}

export const CardForm: React.FC<CardFormProps> = ({
  getInstallments,
  registerNewAddress,
  setRegisterNewAddress,
  cardHolderAddress,
  setCardHolderAddress,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const { isValid, isSubmitting, dirty, setFieldValue, values, errors } = useFormikContext()
  const { deliveryMode, checkoutAddress } = useContext(CheckoutContext)
  const { user } = useContext(AuthContext)
  const { data } = useSWR(`addresses/${user?._id}`, getAddresses)
  const { color } = useTheme()

  const addresses = data ? data.addresses : []

  useEffect(() => {
    if ((values as any).installments.length === 0) {
      getInstallments!().then((value) => {
        if (value) {
          setFieldValue('installments', value)
          setFieldValue('selectedInstallment', value[0])
        }
      })
    }
  }, [getInstallments, setFieldValue, values])

  useEffect(() => {
    if (data && data.addresses.length <= 0) {
      setRegisterNewAddress!(true)
    }
  }, [data, setRegisterNewAddress])

  const showRegisterNewAddress = () => {
    setRegisterNewAddress!(true)
    setCardHolderAddress!(null)
  }

  return (
    <React.Fragment>
      <Stack mb={3} alignItems="center" direction="row" spacing={1}>
        {activeStep === 1 && (
          <IconButton disabled={isSubmitting} onClick={() => setActiveStep(0)} size="medium">
            <ArrowBackIos fontSize={'small'} />
          </IconButton>
        )}
        <Typography fontSize={20}>{activeStep === 1 ? 'Confirmar pedido' : ' Cartão'}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <SealWrapper>
          <img src={SslSeal} alt="" />
        </SealWrapper>
        <SealWrapper>
          <img src={Satisfaction} alt="" />
        </SealWrapper>
        <SealWrapper>
          <img src={SecurePayment} alt="" />
        </SealWrapper>
      </Stack>
      {activeStep === 0 ? (
        <Fragment>
          <CardFormFields values={values} errors={errors} />
          {deliveryMode.includes('store_pickup') && setRegisterNewAddress && (
            <Stack marginY="10px">
              <Typography mb={2} fontSize={14}>
                Endereço do titular
              </Typography>
              <Stack style={{ display: registerNewAddress ? 'block' : 'none' }}>
                <AddressFormFields hideSetMainAddress hideNeighborhoodList parent="address" />
              </Stack>

              <Stack style={{ display: registerNewAddress ? 'none' : 'block' }}>
                <Stack direction="column" spacing={2} alignItems="center" mb={1}>
                  {addresses.map((address) => (
                    <Box
                      key={address._id}
                      width="100%"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setCardHolderAddress!(address)}
                    >
                      <AddressCard
                        selected={cardHolderAddress?._id === address._id}
                        key={address._id}
                        address={address}
                        hideRemove
                      />
                    </Box>
                  ))}
                </Stack>
                <Stack
                  sx={{ cursor: 'pointer', color: color.primary.medium }}
                  onClick={showRegisterNewAddress}
                >
                  Usar outro endereço
                </Stack>
              </Stack>
            </Stack>
          )}
        </Fragment>
      ) : (
        <React.Fragment>
          <Typography mb={1} fontSize={14}>
            Tem alguma observação? (Ex: Entregar após 18h)
          </Typography>
          <Field
            name="comment"
            as={TextField}
            helperText="Não é obrigatório preencher esses campos"
            fullWidth
            multiline
            rows={3}
          />
        </React.Fragment>
      )}

      <Box mt={5}>
        <Button
          variant="contained"
          style={{
            padding: 8,
            textTransform: 'none',
            fontWeight: 400,
            fontSize: 16,
            display: activeStep === 1 ? 'none' : undefined,
          }}
          fullWidth
          disabled={!isValid || isSubmitting || !dirty}
          onClick={() => setActiveStep(1)}
          color="secondary"
          type="button"
        >
          Continuar pagamento
        </Button>

        <Button
          variant="contained"
          style={{
            padding: 8,
            textTransform: 'none',
            fontWeight: 400,
            fontSize: 16,
            display: activeStep === 0 ? 'none' : undefined,
          }}
          fullWidth
          disabled={!isValid || isSubmitting || !dirty || (!registerNewAddress && !checkoutAddress)}
          type={'submit'}
          endIcon={isSubmitting && <CircularProgress size={20} />}
          color="secondary"
        >
          {isSubmitting ? 'Aguarde,gerando cobrança' : 'Confirmar pagamento'}
        </Button>
      </Box>
    </React.Fragment>
  )
}
