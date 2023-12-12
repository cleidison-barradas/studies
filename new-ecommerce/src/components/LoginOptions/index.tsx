import { Box, Stack } from '@mui/material'
import React from 'react'
import { useTheme } from 'styled-components'
import { FacebookIcon, GoogleIcon } from '../../assets/icons'
import { OptionButton } from './styles'

interface LoginOptionsProps {
  onSelectEmail: () => any
  onSelectGoogle: () => void
  onSelectFacebook: () => void
}

export const LoginOptions: React.FC<LoginOptionsProps> = ({ onSelectEmail, onSelectFacebook, onSelectGoogle }) => {
  const { color } = useTheme()
  return (
    <Stack gap={2} width="100%">
      <OptionButton onClick={onSelectGoogle} background="#fff" borderColor={color.neutral.light} color={color.neutral.dark}>
        <GoogleIcon />
        Continuar com o Google
      </OptionButton>
      <OptionButton onClick={onSelectFacebook} background="#1877F2" color={'white'}>
        <FacebookIcon />
        Continuar com o Facebook
      </OptionButton>
      <Box mt={1}>
        <OptionButton
          background="#fff"
          borderColor={color.neutral.darkest}
          color={color.neutral.darkest}
          onClick={onSelectEmail}
        >
          Continuar com o Email
        </OptionButton>
      </Box>
    </Stack>
  )
}
