import React from 'react'
import { Typography, TextField, Button, CircularProgress, Grid } from '@mui/material'
import { Formik, Form } from 'formik'
import { MaskedInput } from '../../components/MaskedInput'
import { formatCPF, validateCPF } from '../../helpers/cpfHelper'
import { Container } from './styles'
import * as yup from 'yup'
import User from '../../interfaces/user'
import { useUser } from '../../hooks/useUser'
import { useAlert } from '../../hooks/useAlert'
import { ErrorCodes } from '../../helpers/errorCodes'

type Props = {
  user: User | null
  cpfRequired?: boolean
  onFinish: () => void
}

export const CompleteCheckoutform: React.FC<Props> = ({ user, cpfRequired, onFinish }) => {
  const { UpdateUser } = useUser()
  const { showMessage } = useAlert()

  const validationSchema = yup.object({
    fullName: yup.string().required('Nome completo é um campo obrigatório'),
    telephone: yup.string().min(11, 'Número inválido').required('Telefone é um campo obrigatório'),
    email: yup.string().required('Email é um campo obrigatório'),
    cpf: cpfRequired
      ? yup.string().test({
          name: 'is-valid-cpf',
          test(value, ctx) {
            const cpf = value?.replace(/\D+/g, '')

            if (cpf && cpf.length > 0) {
              if (validateCPF(cpf)) {
                return true
              }
            }

            return ctx.createError({ message: 'CPF inválido' })
          },
        })
      : yup.string().test({
          name: 'is-valid-cpf',
          test(value, ctx) {
            const cpf = value?.replace(/\D+/g, '')

            if (cpf && cpf.length > 0) {
              if (!validateCPF(cpf)) {
                return ctx.createError({ message: 'CPF inválido' })
              }
            }

            return true
          },
        }),
  })

  const initialValues = {
    ...user,
    fullName: user?.firstname.concat(' ', user.lastname),
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const cpf = values.cpf ? values.cpf : ''
      const email = values.email ? values.email : ''
      const phone = values.telephone ? values.telephone : ''
      const [firstname, ...lastname] = values.fullName ? values.fullName.split(' ') : ['', '']

      const response = await UpdateUser({
        cpf,
        email,
        phone,
        firstname,
        lastname: lastname.toString().replace(/[\W_]+/g, ' '),
      })

      if (response.data?.error) {
        return showMessage(ErrorCodes(response.data.error), 'error')
      }

      onFinish()
    } catch (error) {
      showMessage('ocorreu um erro ao atualizar', 'error')
    }
  }

  return (
    <Container>
      <Typography fontSize={20} mb={2} variant="h4">
        {cpfRequired ? 'CPF é obrigatório para este tipo de entrega' : 'Complete seus dados'}
      </Typography>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, errors, isValid, isSubmitting }) => (
          <Form>
            <Grid mb={3} container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                {user && user.firstname.length <= 0 && (
                  <>
                    <Typography>Nome completo</Typography>
                    <TextField
                      fullWidth
                      name="fullName"
                      autoComplete="off"
                      value={values.fullName}
                      onChange={handleChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                {user && !user.cpf && (
                  <>
                    <Typography> CPF {cpfRequired ? '' : '(Opcional)'}</Typography>
                    <MaskedInput
                      name="cpf"
                      fullWidth
                      mask="999.999.999-99"
                      autoComplete="off"
                      error={!!errors.cpf}
                      helperText={errors.cpf}
                      onChange={handleChange}
                      value={formatCPF(values.cpf || '')}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {user && user.telephone.length <= 0 && (
                  <>
                    <Typography>Número Celular</Typography>
                    <MaskedInput
                      fullWidth
                      name="telephone"
                      autoComplete="off"
                      mask="(99) 99999-9999"
                      onChange={handleChange}
                      value={values.telephone}
                      error={!!errors.telephone}
                      helperText={errors.telephone}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {user && user.email.length <= 0 && (
                  <>
                    <Typography>E-mail</Typography>
                    <TextField
                      name="email"
                      fullWidth
                      autoComplete="off"
                      value={values.email}
                      error={!!errors.email}
                      onChange={handleChange}
                      helperText={errors.email}
                    />
                  </>
                )}
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              type="submit"
              disabled={!isValid}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Confirmar'}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
