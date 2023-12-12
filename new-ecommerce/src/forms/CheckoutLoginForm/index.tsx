import { Stack, Typography } from '@mui/material'

import React, { useContext, useEffect } from 'react'

import AuthContext from '../../contexts/auth.context'

import { LoginForm } from '../LoginForm'

interface CheckoutLoginFormProps {
  onFinish: () => void
}

export const CheckoutLoginForm: React.FC<CheckoutLoginFormProps> = ({ onFinish }) => {
  const { user, store } = useContext(AuthContext)

  useEffect(() => {
    if (user) onFinish()
  }, [user, onFinish])

  return (
    <Stack flex={1}>
      {!store?.settings.config_social_login && (
        <Typography mb={2} fontSize={20}>Para finalizar é rápido, fácil e seguro.</Typography>
      )}
      <LoginForm
        title="Para finalizar é rápido, fácil e seguro."
        caption="Como deseja continuar?"
        onFinish={onFinish}
        themeColor="secondary"
        alignCaption="left"
        alignTitle="left"
        textButton="Continuar"
      />
    </Stack>
  )
}
