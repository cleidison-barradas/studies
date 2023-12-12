import { Stack } from '@mui/material'
import React, { useContext } from 'react'
import { SocialButton } from '../../components/SocialButton'
import AuthContext from '../../contexts/auth.context'

export const SocialLoginForm = () => {
  const { store } = useContext(AuthContext)
  const active = store?.settings.config_social_login || false

  const handleSocialLogin = (social: string) => {
    if (social === 'google') {
      window.location.replace(store?.googleUrl!)
    }
    if (social === 'facebook') {
      window.location.replace(store?.facebookUrl!)
    }
  }

  return (
    <Stack gap={1}>
      {active && <SocialButton google onClick={() => handleSocialLogin('google')} />}
      {active && <SocialButton facebook onClick={() => handleSocialLogin('facebook')} />}
    </Stack>
  )
}
