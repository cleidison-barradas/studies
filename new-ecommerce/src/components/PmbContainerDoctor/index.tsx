import React from 'react'
import { Field, Form, Formik } from 'formik'
import { Box, Button, CircularProgress, Grid, MenuItem, Stack, Typography } from '@mui/material'
import * as yup from 'yup'

import { RequestCustomerPreAuthorization } from '../../services/epharma/request.interface'
import { postCustomerPreAuthorization } from '../../services/epharma/epharma.service'

import SelectFormField from '../SelectFormField'
import TextFormField from '../TextFormField'
import { MaskedInput } from '../MaskedInput'

import { getStateCodes } from '../../helpers/getStateCode'

import { useCart } from '../../hooks/useCart'
import { useAlert } from '../../hooks/useAlert'
import { ErrorCodes } from '../../helpers/errorCodes'
import { isValidDate } from '../../helpers/validateDate'
import { ICampaingProps } from '../LaboratoryCampaign'

interface Props {
  eans: string[]
  fingerprint: string
  elegibilityToken: string
  onFinish: React.Dispatch<React.SetStateAction<ICampaingProps>>
}

const validationSchema = yup.object({
  prescriptor: yup.object({
    prescritorState: yup.string().required('Estado é obrigatório'),
    medicalProfessionalCouncil: yup.number().nullable(true).required('Tipo de registro é obrigatório'),
    prescriptorName: yup.string().nullable(true).when('medicalProfessionalCouncil', {
      is: 1,
      then: yup.string().required('Nome do médico (a) é obrigatório')
    }),
    prescriptorId: yup.string().nullable(true).test({
      name: 'valid-crm',
      test(value, ctx) {
        const data = value?.replace(/\D+/g, '')

        if (data && data.length > 0) return true

        return ctx.createError({ message: 'CRM/CRO do médico é obrigatório' })
      }
    }),
    prescriptorRecipeDate: yup.string().nullable(true).test({
      name: 'valid-date',
      test(value, ctx) {
        if (value && isValidDate(value)) return true

        return ctx.createError({ message: 'Data da receita é obrigatório!' })
      }
    }),
  })
})

const PmbContainerDoctor: React.FC<Props> = ({ eans, fingerprint, elegibilityToken, onFinish }) => {
  const { setAuthorization } = useCart()
  const { showMessage } = useAlert()

  const initialValues: RequestCustomerPreAuthorization = {
    eans,
    fingerprint,
    elegibilityToken,
    prescriptor: {
      prescriptorId: null,
      prescriptorName: '',
      prescritorState: '',
      prescriptorRecipeDate: null,
      medicalProfessionalCouncil: 2,
    }
  }

  const handleSubmit = async (data: RequestCustomerPreAuthorization) => {
    try {
      const response = await postCustomerPreAuthorization(data)

      if (response) {
        const { error } = response

        if (error) {
          return showMessage(ErrorCodes(error), 'error')
        }

        setAuthorization(response.authorization)
        onFinish({ needsDoctorData: false, needsRegister: false })
      }

    } catch (error) {
      showMessage(`Ocorreu um problema ${error}`, 'error')
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
        borderRadius='20px'
        sx={{ background: '#FFFF81' }}
      >
        <Stack
          margin={5}
          spacing={2}
        >
          <Typography fontSize={18} >Vamos precisar que você preencha os campos abaixo</Typography>
          <Typography fontSize={14} >O laboratório precisa de informações adicionais para autorizar o seu desconto.</Typography>
          <Typography fontSize={12} >Informações sobre o médico e receita:</Typography>
          <Formik
            enableReinitialize
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, values, errors }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={6} xl={6}>
                    <Field name="prescriptor.prescritorState" label="Estado (UF)" component={SelectFormField}>
                      {getStateCodes().map(state => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  {values.prescriptor.medicalProfessionalCouncil === 1 && (
                    <Grid item xs={12} sm={6} lg={6} xl={6}>
                      <Field name="prescriptor.prescriptorName" label="Nome do médico (a)" autoComplete="off" component={TextFormField} />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} lg={6} xl={6}>
                    <Field name="prescriptor.medicalProfessionalCouncil" label="Tipo do registro" component={SelectFormField}>
                      <MenuItem key={1} value={1}>
                        CRM
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        CRO
                      </MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} xl={6}>
                    <Field name="prescriptor.prescriptorId" label="CRM/CRO" autoComplete="off" component={TextFormField} />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} xl={6}>
                    <Field
                      name="prescriptor.prescriptorRecipeDate"
                      as={MaskedInput}
                      mask="99/99/9999"
                      autoComplete='off'
                      label="Data da receita"
                      value={values.prescriptor.prescriptorRecipeDate}
                      error={!!errors.prescriptor?.prescriptorRecipeDate}
                      helperText={errors.prescriptor?.prescriptorRecipeDate}
                    />
                  </Grid>
                </Grid>
                <Box>
                  <Box width="100%" mt={5}>
                    <Button
                      type='submit'
                      style={{
                        border: 'none',
                        color: '#BD0B0B',
                        fontFamily: 'Poppins',
                        background: '#FFA4A4',
                      }}
                    >
                      {isSubmitting ? <CircularProgress size={20} /> : 'Informar dados'}
                    </Button>
                    <Button
                      style={{
                        border: 'none',
                        fontFamily: 'Poppins'
                      }}
                      onClick={() => onFinish({ needsDoctorData: false, needsRegister: false })}
                    >
                      Voltar</Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PmbContainerDoctor
