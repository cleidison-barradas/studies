import React, { useState } from 'react'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { Button } from '@mypharma/react-components'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { RegisterForm } from '../RegisterForm'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/useAuth'
import { useAlert } from '../../hooks/useAlert'
import { LoginOptions } from '../../components/LoginOptions'
import { ReturnButton } from '../../components/ReturnButton'
import TextFormField from '../../components/TextFormField'
import { findEmail } from '../../services/customer/customer.service'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

interface LoginFormProps {
  handleClose?: (event?: any) => void
  onFinish?: () => void
  title?: string
  caption?: string
  alignCaption?: string
  alignTitle?: string
  themeColor?: 'secondary' | 'primary'
  textButton?: string
}

interface LoginFormData {
  email: string
  password: string
}

const validationSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('campo obrigatório'),
  password: yup.string(),
})

export const LoginForm: React.FC<LoginFormProps> = ({
  onFinish,
  title,
  caption,
  themeColor,
  alignTitle = 'center',
  alignCaption = 'center',
  textButton = 'Entrar',
}) => {
  const [notFound, setNotFound] = useState<boolean | undefined>(undefined)
  const [notFoundEmail, setNotFoundEmail] = useState<string | undefined>()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const { showMessage } = useAlert()
  const { EmailLogin, store } = useAuth()

  const hasLoginSocial = store?.settings.config_social_login

  const [isEmailOption, setIsEmailOption] = useState(hasLoginSocial ? false : true)
  const { color } = useTheme()

  const initialValues = {
    email: '',
    password: '',
  } as LoginFormData

  const handleFindRegisteredEmail = async (email: string) => {
    const response = await findEmail(email)

    if (response.data?.exist === true) {
      setNotFound(false)
      return false
    } else {
      setNotFound(true)
      setNotFoundEmail(email)
      return true
    }
  }

  const handleSubmit = async ({ email, password }: LoginFormData) => {
    if (notFound === undefined) {
      await handleFindRegisteredEmail(email)
    }

    if (notFound === false) {
      const res = await EmailLogin(email, password)
      if (res?.user) {
        if (onFinish) onFinish()
        showMessage('Usúario autenticado', 'success')
      } else showMessage('Usuário ou senha incorretos', 'error')
    }
  }

  const onSelectLoginOption = () => {
    setIsEmailOption(true)
  }

  function handleConsentScreenGoogle() {
    if (store) {
      const { googleUrl } = store
      window.location.replace(googleUrl)
    }
  }

  function handleConsentScreenFacebook() {
    if (store) {
      const { facebookUrl } = store
      window.location.replace(facebookUrl)
    }
  }

  return !isEmailOption && hasLoginSocial ? (
    <React.Fragment>
      <Typography mb={1} fontSize={20} textAlign={alignTitle as any}>
        {title}
      </Typography>
      <Typography variant="subtitle1" mb={3} textAlign={alignCaption as any}>
        {caption}
      </Typography>
      <LoginOptions
        onSelectEmail={onSelectLoginOption}
        onSelectFacebook={handleConsentScreenFacebook}
        onSelectGoogle={handleConsentScreenGoogle}
      />
    </React.Fragment>
  ) : (
    <Box>
      {notFound === true ? (
        <RegisterForm
          fullWidth
          email={notFoundEmail}
          onReturn={() => {
            setNotFound(undefined)
          }}
          color={themeColor}
          onFinish={() => {
            if (onFinish) onFinish()
          }}
        />
      ) : (
        <React.Fragment>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ isValid, isSubmitting, setValues }) => (
              <Form>
                <Stack position="relative" alignItems="center" direction="row" gap={2} mb={2}>
                  {hasLoginSocial || notFound === false ? (
                    <ReturnButton
                      onClick={() => {
                        setIsEmailOption(false)
                        setValues(initialValues)
                        setNotFound(undefined)
                      }}
                    />
                  ) : undefined}
                  <Typography fontSize={18}>Entre com seu e-mail</Typography>
                </Stack>
                <Stack spacing={5}>
                  {notFound === undefined && (
                    <Stack spacing={1}>
                      <Field component={TextFormField} name="email" />
                    </Stack>
                  )}
                  {notFound === false && (
                    <Stack gap={1}>
                      <Typography>Digite sua senha</Typography>
                      <Field
                        component={TextFormField}
                        fullWidth
                        name="password"
                        type={passwordVisible ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Exibir senha"
                                onClick={() => setPasswordVisible((value) => !value)}
                              >
                                {passwordVisible ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box mt={2}>
                        <Typography>
                          Não lembra da sua senha?
                          <Link ml={1} to="/recuperar-senha" component={RouterLink}>
                            Recuperar Senha
                          </Link>
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                  <Button
                    variant="filled"
                    disabled={!isValid || isSubmitting}
                    textColor={color.cta}
                    color={themeColor}
                    size="large"
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : textButton}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </React.Fragment>
      )}
    </Box>
  )
}
