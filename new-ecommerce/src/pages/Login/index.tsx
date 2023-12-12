import React from 'react'
import { LoginForm } from '../../forms/LoginForm'
import { useNavigate } from 'react-router'
import {
  LoginIlustrationDesktop,
  LoginMobileBackground,
  LoginDesktopBackground,
} from '../../assets/ilustration'
import { AuthContainer } from '../../components/AuthContainer'

const Login: React.FC = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <AuthContainer
        background={<LoginDesktopBackground />}
        mobileBackground={<LoginMobileBackground />}
        ilustration={<LoginIlustrationDesktop />}
      >
        <LoginForm
          title="Falta pouco para comprar!"
          caption="Como deseja continuar?"
          onFinish={() => navigate('/produtos')}
        />
      </AuthContainer>
    </React.Fragment>
  )
}

export default Login
