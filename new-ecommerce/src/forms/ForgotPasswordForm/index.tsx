import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import { useTheme } from 'styled-components'
import { ChatIlustration, ForgotPasswordIlustration } from '../../assets/ilustration'
import * as yup from 'yup'
import { forgotPassword } from '../../services/customer/customer.service'
import AlertContext from '../../contexts/alert.context'

interface ForgotPasswordFormData {
  email: string
}

interface ForgotPasswordFormProps {
  onReturn: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onReturn }) => {
  const { color } = useTheme()
  const [isRecoverEmailSent, setIsRecoverEmailSent] = useState(false)
  const { setAlert } = useContext(AlertContext)

  const initialValues: ForgotPasswordFormData = {
    email: '',
  }

  const validationSchema = yup.object().shape({
    email: yup.string().required().email(),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { email } = data
    const response = await forgotPassword(email)

    if (response.ok) setIsRecoverEmailSent(true)
    else setAlert({ message: (response.data as any).message, severity: 'error', open: true })
  }

  return isRecoverEmailSent ? (
    <Stack spacing={3}>
      <Stack>
        <Typography fontSize={18}> Confira seu e-mail ✌ </Typography>
        <Typography color={color.neutral.dark} fontSize={12}>
          Enviamos o e-mail para que possa criar sua nova senha, certifique-se que o e-mail não está
          na caixa de spam.
        </Typography>
      </Stack>
      <Stack justifyContent="center" alignItems="center">
        <ChatIlustration color={color.primary.medium} height={150} />
      </Stack>
      <Button fullWidth onClick={onReturn} variant="contained" color="primary">
        Voltar para o login
      </Button>
    </Stack>
  ) : (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <Stack spacing={5}>
            <Stack>
              <Typography textAlign="center" fontSize={18}>
                Recuperação de senha
              </Typography>
              <Typography textAlign="center" color={color.neutral.dark} fontSize={12}>
                Você receberá um link no e-mail cadastrado para criar uma nova senha em até 50
                minutos.
              </Typography>
            </Stack>
            <Stack justifyContent="center" alignItems="center">
              <ForgotPasswordIlustration height={150} color={color.primary.medium} />
            </Stack>
            <Stack gap={3}>
              <Stack>
                <Typography>E-mail</Typography>
                <Field name="email" type="email" as={TextField} />
              </Stack>
              <Button
                type="submit"
                endIcon={isSubmitting && <CircularProgress size={20} />}
                disabled={isSubmitting || !isValid || !dirty}
                variant="contained"
                color="primary"
              >
                {isSubmitting ? 'Enviando email' : 'Solicitar e-mail'}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
