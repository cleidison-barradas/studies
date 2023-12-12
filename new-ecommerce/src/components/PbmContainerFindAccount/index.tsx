import React from 'react'
import { Box, Stack, Typography, Divider, Button, CircularProgress } from '@mui/material'
import { Formik, Field, Form } from 'formik'
import * as yup from 'yup'

import { postCustomerElegibility } from '../../services/epharma/epharma.service'

import { useAlert } from '../../hooks/useAlert'
import { useCart } from '../../hooks/useCart'

import { floatToBRL } from '../../helpers/moneyFormat'
import { Benefit } from '../../interfaces/benefit'
import Product from '../../interfaces/product'
import { MaskedInput } from '../MaskedInput'
import { CampaignInputPrice } from './styles'
import { ICampaingProps } from '../LaboratoryCampaign'

interface Props {
  pbmToPrice: number
  fingerprint: string
  product: Product | null
  benefit: Benefit | null
  onFinish: React.Dispatch<React.SetStateAction<ICampaingProps>>
}

interface InitialValues {
  ean: string
  benefitId: number
  fingerprint: string
  identifyCustomer: string
}

const PbmContainerFindAccount: React.FC<Props> = ({ fingerprint, benefit = null, product = null, pbmToPrice = 0, onFinish }) => {
  const { setAuthorization } = useCart()
  const { showMessage } = useAlert()

  const initialValues: InitialValues = {
    fingerprint,
    identifyCustomer: '',
    ean: product?.EAN || '',
    benefitId: benefit?.originalId || 0
  }

  const validationSchema = yup.object({
    identifyCustomer: yup.string().test({
      name: 'identify-valid',
      test(value, ctx) {
        const identify = value?.replace(/[^0-9]+/g, '')

        if (identify) return true
        return ctx.createError({ message: 'identificador inválido!' })
      }
    }).required('A identificação é obrigatória!')
  })

  const handleSubmit = async (data: InitialValues) => {
    try {

      const response = await postCustomerElegibility(data)

      if (response) {

        if (response.error) {

          return showMessage('Ocorreu um problema', 'error')
        }
        const { needsDoctorData, needsRegister, authorization = null } = response

        setAuthorization(authorization)

        onFinish({ needsDoctorData, needsRegister })
      }

    } catch (error) {
      showMessage(`Ocorreu um problema: ${error}`, 'error')
    }
  }

  return (
    <Box
      display='flex'
      borderRadius={5}
      flexDirection='column'
      border='1px solid #E0E8F0'
    >
      <Stack
        borderRadius='20px 20px 0 0'
        sx={{ background: 'rgba(224, 232, 240, 0.4)' }}
      >
        <Box
          display='flex'
          margin={2}
        >
          <Typography
            color='red'
            fontSize={20}
            textTransform='uppercase'
          >{benefit?.clientName}</Typography>
        </Box>
        <Stack
          spacing={1}
          direction='row'
          margin={2}
          divider={<Divider orientation='vertical' variant='middle' flexItem />}
        >
          <Box
            maxWidth="50%"
            display='flex'
            flexDirection='column'
          >
            <Typography
              fontSize={20}
            >
              {benefit?.benefitName}
            </Typography>
            <Typography
              fontSize={12}
              fontFamily='Montserrat'
            >Aproveite os beneficios do programa {benefit?.benefitName}</Typography>
          </Box>

          <Box
            maxWidth="50%"
            display='flex'
            flexDirection='column'
          >
            <CampaignInputPrice>{floatToBRL(pbmToPrice)}</CampaignInputPrice>
          </Box>
        </Stack>
      </Stack>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack
              display='flex'
              margin='20px 20px'
              flexDirection='column'
            >
              <Field
                as={MaskedInput}
                label="Digite o CPF."
                mask="999.999.999-99"
                name="identifyCustomer"
              />
              <Button
                fullWidth
                type='submit'
                variant='contained'
                style={{ marginTop: 20 }}
              >
                {isSubmitting ? <CircularProgress size={30} color='inherit' /> : 'Solicitar Desconto'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default PbmContainerFindAccount
