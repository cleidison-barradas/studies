import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { recoverPassword } from '../../services/customer/customer.service'
import * as yup from 'yup'
import { PasswordInput } from '../../components/PasswordInput'
import { useAlert } from '../../hooks/useAlert'

interface UpdatePasswordFormData {
  password: ''
  confirmPassword: ''
}

interface UpdatePasswordFormProps {
  onSuccess: () => any
}

export const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ onSuccess }) => {
  const { token } = useParams()
  const { logout } = useAuth()
  const { showMessage } = useAlert()

  const initialValues: UpdatePasswordFormData = {
    password: '',
    confirmPassword: '',
  }

  const onSubmit = async (data: UpdatePasswordFormData) => {
    const { password, confirmPassword } = data

    if (password !== confirmPassword) return ''

    const response = await recoverPassword({ token: token!, password })

    if (response.ok) {
      logout()
      onSuccess()
    } else
      showMessage(
        (response.data as any).message || 'Falha ao alterar senha, tente novamente',
        'error'
      )
  }

  const validationSchema = yup.object().shape({
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], 'Senhas diferentes'),
  })

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          <Stack spacing={3}>
            <div>
              <Typography mb={1}>Digite sua nova senha</Typography>
              <Field as={PasswordInput} name="password" fullWidth placeholder="Sua senha aqui" />
            </div>
            <div>
              <Typography mb={1}>Confirme sua nova senha</Typography>
              <Field
                as={PasswordInput}
                name="confirmPassword"
                fullWidth
                placeholder="Repita a senha"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
              variant="contained"
              color="primary"
              size="large"
              endIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? 'Alterando senha ' : 'Criar nova senha'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
