import React, { useContext } from 'react'
import AuthContext from '../../contexts/auth.context'
import { Container } from './styles'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { useUser } from '../../hooks/useUser'
import { Button, CircularProgress, Grid } from '@mui/material'
import TextFormField from '../TextFormField'
import { TWO_WORDS_REQUIRED } from '../../helpers/regexes'
import { useAlert } from '../../hooks/useAlert'

const SubmitErros: Record<string, string> = {
  cpf_already_exists: 'CPF já cadastrado'
}

const validationSchema = yup.object({
  fullname: yup
    .string()
    .matches(TWO_WORDS_REQUIRED, 'Escreva nome e sobrenome')
    .required('nome obrigatório'),
  cpf: yup.string(),
  telephone: yup.string().required('telefone é obrigatorio'),
  email: yup.string().email('email inválido').required('email é obrigatorio'),
})

export const EditProfileContainer: React.FC = () => {
  const { user } = useContext(AuthContext)
  const { UpdateUser } = useUser()
  const { showMessage } = useAlert()

  const initialValues = user
    ? {
      ...user,
      fullname: `${user.firstname} ${user.lastname}`,
    }
    : { fullname: '', cpf: '', telephone: '', email: '' }

  const submitForm = async (values: typeof initialValues) => {
    const username = values.fullname.split(' ')

    const response = await UpdateUser({
      firstname: username.shift()!,
      lastname: username.join(' '),
      email: values.email || '',
      cpf: values.cpf || null,
      phone: values.telephone,
    })

    if (!response.ok) {
      const error = response.data?.error || ''
      showMessage(SubmitErros[error] || 'Ocorreu um erro inesperado', 'error')
    } else {
      showMessage('Usuário atualizado', 'success')
    }
  }

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitForm}
        enableReinitialize
      >
        {({ isValid, isSubmitting, dirty }) => {
          return (
            <Form>
              <Grid mb={3} container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    label="Nome completo"
                    component={TextFormField}
                    fullWidth
                    required
                    name="fullname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field component={TextFormField} label="CPF" fullWidth name="cpf" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextFormField}
                    label="Número Celular"
                    fullWidth
                    name="telephone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field label="E-mail"
                    disabled={true}
                    component={TextFormField}
                    fullWidth
                    name="email" />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
                disabled={!isValid || isSubmitting || !dirty}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Confirmar'}
              </Button>
            </Form>
          )
        }}
      </Formik>
    </Container>
  )
}
