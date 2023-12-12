import { Hidden, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CDN } from '../../config/keys'
import { useAuth } from '../../hooks/useAuth'
import { useLayout } from '../../hooks/useLayout'
import { useTabBar } from '../../hooks/useTabBar'
import { Logo } from '../Header/styles'
import {
  LoginContainer,
  BackgroundContainer,
  LoginHeader,
  FormContainer,
  Ilustration,
  FormPaper,
} from './styles'

interface AuthContainerProps {
  ilustration: React.ReactNode
  background: React.ReactNode
  mobileBackground: React.ReactNode
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  ilustration,
  background,
  mobileBackground,
  children,
}) => {
  const { store } = useAuth()

  const { toggleLayout } = useLayout()
  const { toggleTabBar } = useTabBar()

  useEffect(() => {
    toggleLayout()
    toggleTabBar()
    return () => {
      toggleLayout()
      toggleTabBar()
    }
  }, [toggleLayout, toggleTabBar])

  return (
    <React.Fragment>
      <LoginContainer>
        <BackgroundContainer>
          <Hidden lgUp>{mobileBackground}</Hidden>
          <Hidden lgDown>{background}</Hidden>
        </BackgroundContainer>
        <LoginHeader>
          <Link to="/produtos">
            <Logo src={new URL(store?.settings.config_logo || '', CDN.image).href} alt="logo" />
          </Link>
        </LoginHeader>
        <FormContainer>
          <Stack
            zIndex={2}
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ xs: 'center' }}
            height={'100%'}
            justifyContent={{ xs: 'normal', lg: 'flex-end' }}
            gap={{ xs: 0, lg: '80px' }}
          >
            <Ilustration>{ilustration}</Ilustration>
            <FormPaper>{children}</FormPaper>
          </Stack>
        </FormContainer>
      </LoginContainer>
    </React.Fragment>
  )
}
