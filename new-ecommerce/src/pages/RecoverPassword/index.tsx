import { Button, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  ChatIlustration,
  ChatNotificationIlustration,
  LoginDesktopBackground,
  LoginIlustrationDesktop,
  LoginMobileBackground,
  RecoverPasswordIlustration,
} from '../../assets/ilustration'
import { AuthContainer } from '../../components/AuthContainer'
import { RecoverPasswordForm } from '../../forms/RecoverPassword'
import { UpdatePasswordForm } from '../../forms/UpdatePasswordForm'
import AuthContext from '../../contexts/auth.context'

export const RecoverPassword: React.FC = () => {
  const { token } = useParams()

  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false)
  const navigate = useNavigate()

  const onSubmitEmail = () => {
    setIsEmailSent(true)
  }

  const onUpdatePassword = () => {
    setIsPasswordUpdated(true)
  }

  const handleIlustrationRender = () => {
    if (isPasswordUpdated) return <LoginIlustrationDesktop />
    if (token) return <ChatNotificationIlustration />
    if (isEmailSent) return <ChatIlustration />

    return <RecoverPasswordIlustration />
  }

  const { store } = useContext(AuthContext)
  const isGenericStore = store?.plan.rule.includes('generic')

  const handleFormRender = () => {
    if (isPasswordUpdated) {
      return (
        <React.Fragment>
          <Typography mb={2} textAlign="center" fontSize={20}>
            Senha atualizada com sucesso!
          </Typography>
          <Typography mb={3} fontSize={14} variant="subtitle1" textAlign="center">
            {isGenericStore ? "Sua nova senha já está liberada para você acessar a loja e fazer suas compras." : "Sua nova senha já está liberada para você acessar a farmácia e fazer suas compras."}
          </Typography>
          <Button
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
            variant="contained"
            fullWidth
          >
            Acessar Login
          </Button>
        </React.Fragment>
      )
    }

    if (isEmailSent) {
      return (
        <React.Fragment>
          <Typography mb={2} textAlign="center" fontSize={20}>
            Confira seu e-mail ✌
          </Typography>
          <Typography mb={3} fontSize={14} variant="subtitle1" textAlign="center">
            Enviamos o e-mail para que possa criar sua nova senha, certifique-se que o e-mail não
            está na caixa de spam.
          </Typography>
          <Button
            color="primary"
            onClick={() => navigate('/login')}
            size="large"
            variant="contained"
            fullWidth
          >
            Voltar para o login
          </Button>
        </React.Fragment>
      )
    }

    if (token) {
      return (
        <React.Fragment>
          <Typography mt={4} mb={4} fontSize={20} textAlign="center">
            Crie uma nova senha
          </Typography>
          <UpdatePasswordForm onSuccess={onUpdatePassword} />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Typography mt={4} mb={4} fontSize={20} textAlign="center">
          Recuperação de senha
        </Typography>
        <Typography fontSize={14} variant="subtitle1" textAlign="center">
          Você receberá um link no e-mail cadastrado para criar uma nova senha em até 50 minutos.
        </Typography>
        <RecoverPasswordForm onSuccess={onSubmitEmail} />
      </React.Fragment>
    )
  }

  return (
    <AuthContainer
      background={<LoginDesktopBackground />}
      mobileBackground={<LoginMobileBackground />}
      ilustration={handleIlustrationRender()}
    >
      {handleFormRender()}
    </AuthContainer>
  )
}
