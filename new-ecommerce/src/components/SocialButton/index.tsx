import React from 'react'
import { AppleIcon, FacebookIcon, GoogleIcon } from '../../assets/icons'
import { SocialButtonProps, Button } from './styles'

export const SocialButton: React.FC<SocialButtonProps> = ({ google, facebook, apple, onClick }) => {
  return (
    <Button google={google} facebook={facebook} apple={apple} onClick={onClick}>
      {google && <GoogleIcon />}
      {facebook && <FacebookIcon />}
      {apple && <AppleIcon />}

      {google && 'Continuar com Google'}
      {facebook && 'Continuar com Facebook'}
      {apple && 'Continuar com Apple'}
    </Button>
  )
}
