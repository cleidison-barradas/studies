import { Stack, Button, CircularProgress } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import React from 'react'
import TextFormField from '../../components/TextFormField'
import * as yup from 'yup'
import { forgotPassword } from '../../services/customer/customer.service'
import { useAlert } from '../../hooks/useAlert'

interface RecoverPasswordFormProps {
  onSuccess: () => any
}

interface RecoverPasswordFormData {
  email: string
}

const validateSchema = yup.object({
  email: yup.string().email('email invalido').required('email obrigatório'),
})

export const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = ({ onSuccess }) => {
  const { showMessage } = useAlert()

  const initialValues: RecoverPasswordFormData = {
    email: '',
  }

  const onSubmit = async (data: RecoverPasswordFormData) => {
    const response = await forgotPassword(data.email)
    if (response.ok) onSuccess()
    else {
      showMessage(
        (response.data as any).message ||
          'não foi possivel enviar seu email, tente novamente mais tarde',
        'error'
      )
    }
  }

  return (
    <Formik initialValues={initialValues} validateSchema={validateSchema} onSubmit={onSubmit}>
      {({ isSubmitting, dirty, isValid }) => (
        <Form>
          <Stack mb={4} mt={4} spacing={4}>
            <Field label="email" component={TextFormField} name="email" />
            <Button
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              endIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? 'Enviando e-mail' : 'Solicitar e-mail'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
