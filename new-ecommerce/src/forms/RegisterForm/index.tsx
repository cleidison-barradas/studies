import {
  Grid,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  CircularProgress,
  Box,
  Link,
  Stack,
} from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { Container } from './styles'
import * as yup from 'yup'
import { TWO_WORDS_REQUIRED } from '../../helpers/regexes'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useUser } from '../../hooks/useUser'
import { useAlert } from '../../hooks/useAlert'
import TextFormField from '../../components/TextFormField'
import { ReturnButton } from '../../components/ReturnButton'
import { MaskedInput } from '../../components/MaskedInput'
import { validateCPF } from '../../helpers/cpfHelper'
import { validatePHONE } from '../../helpers/validatePhone'

const SubmitErrosCode: Record<string, string> = {
  cpf_already_exist: 'CPF já cadastrado',
  email_already_exits: 'EMAIL já cadastrado',
}

const validationSchema = yup.object({
  fullName: yup
    .string()
    .required('Nome completo é um campo obrigatório')
    .matches(TWO_WORDS_REQUIRED, 'Escreva nome e sobrenome'),
  cpf: yup.string().test({
    name: 'is-valid-cpf',
    test(value, ctx) {
      const cpf = value?.replace(/\D+/g, "")

      if (cpf && cpf.length > 0) {

        if (!validateCPF(cpf)) {
          return ctx.createError({ message: 'CPF inválido' })
        }
      }
      return true
    }
  }),
  telephone: yup.string().test({
    name: 'phone-is-valid',
    test(value, ctx) {
      if (validatePHONE(value)) {
        return true
      }
      return ctx.createError({ message: 'Telefone inválido' })
    }
  }),
  email: yup.string().email('Email inválido').required('Email é um campo obrigatório'),
  password: yup.string().min(5, 'Senha muito curta'),
  confirmPassword: yup
    .string()
    .required('Você precisa confirmar sua senha')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: yup.string().oneOf([yup.ref('password')], 'Senhas precisam ser iguais'),
    }),
})

const validationSchemaFirstStep = yup.object({
  fullName: yup
    .string()
    .required('Nome completo é um campo obrigatório')
    .matches(TWO_WORDS_REQUIRED, 'Escreva nome e sobrenome'),
  cpf: yup.string().test({
    name: 'is-valid-cpf',
    test(value, ctx) {
      const cpf = value?.replace(/\D+/g, "")

      if (cpf && cpf.length > 0) {
        if (!validateCPF(cpf)) {
          return ctx.createError({ message: 'CPF inválido' })
        }
      }
      return true
    }
  }),
  telephone: yup.string().test({
    name: 'phone-is-valid',
    test(value, ctx) {
      if (validatePHONE(value)) {
        return true
      }
      return ctx.createError({ message: 'Telefone inválido' })
    }
  }),
  email: yup.string().email('Email inválido').required('Email é um campo obrigatório'),
})

interface RegisterContainerProps {
  fullWidth?: boolean
  onFinish: () => void
  onReturn: () => void
  email?: string
  color?: 'primary' | 'secondary'
}

export const RegisterForm: React.FC<RegisterContainerProps> = ({
  onReturn,
  onFinish,
  email = '',
  color = 'primary',
  fullWidth = false,
}) => {
  const [step, setStep] = useState(0)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const { RegisterUser } = useUser()
  const { showMessage } = useAlert()

  const initialValues = {
    email,
    cpf: '',
    fullName: '',
    password: '',
    telephone: '',
    confirmPassword: '',
  }

  const submit = async (values: typeof initialValues, helpers: FormikHelpers<any>) => {
    if (step === 0) {
      setStep(1)
      return await helpers.validateForm()
    }

    const [firstname, ...lastname] = values.fullName ? values.fullName.split(' ') : ['', '']

    const res = await RegisterUser({
      firstname,
      cpf: values.cpf,
      email: values.email,
      password: values.password,
      telephone: values.telephone,
      lastname: lastname.toString().replace(/[\W_]+/g, ' '),
    })

    if (!res.ok) {
      if (res.status === 400) {
        const error = res.data?.error || ''
        showMessage(SubmitErrosCode[error] || 'Ocorreu um erro inesperado', 'error')
        const [field] = error.split('_')

        setStep(0)
        helpers.setFieldError(field, `${field} já cadastrado`)
      } else showMessage((res.data as any).error, 'error')
      return
    }

    onFinish()
  }

  return (
    <Container>
      <Formik
        onSubmit={submit}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={step === 0 ? validationSchemaFirstStep : validationSchema}
      >
        {({ isValid, isSubmitting, values, errors }) => (
          <Form>
            <Stack
              position="relative"
              alignItems="center"
              direction="row"
              justifyContent={'center'}
              mb={4}
            >
              <Box position="absolute" left="0">
                <ReturnButton
                  onClick={() => {
                    if (step === 0) onReturn()
                    if (step > 0) setStep((value) => value - 1)
                  }}
                />
              </Box>
              <Typography fontSize={20}>Entrar com e-mail</Typography>
            </Stack>
            <Grid mb={3} container spacing={2}>
              {step === 0 && (
                <React.Fragment>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography>Nome completo</Typography>
                    <Field component={TextFormField} fullWidth name="fullName" autoComplete="off" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography>Número Celular</Typography>
                    <Field as={MaskedInput} mask="(99) 99999-9999" value={values.telephone} error={!!errors.telephone} helperText={errors.telephone} fullWidth name="telephone" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography> CPF (Opcional)</Typography>
                    <Field as={MaskedInput} mask="999.999.999-99" value={values.cpf} error={!!errors.cpf} helperText={errors.cpf} fullWidth name="cpf" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography>E-mail</Typography>
                    <Field component={TextFormField} type="email" fullWidth name="email" autoComplete="off" />
                  </Grid>
                </React.Fragment>
              )}
              {step === 1 && (
                <React.Fragment>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography>Crie uma senha</Typography>
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
                              onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                              {passwordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={fullWidth ? 12 : 6}>
                    <Typography>Confirme a senha</Typography>
                    <Field
                      component={TextFormField}
                      fullWidth
                      name="confirmPassword"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Exibir senha"
                              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            >
                              {confirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      type={confirmPasswordVisible ? 'text' : 'password'}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color={color}
              size="large"
              type="submit"
              disabled={!isValid}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Continuar'}
            </Button>
            <Typography textAlign="center" mt={3}>
              Já tem conta?
              <Link ml={1} style={{ cursor: 'pointer' }} color={color} onClick={onReturn}>
                Entrar
              </Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
