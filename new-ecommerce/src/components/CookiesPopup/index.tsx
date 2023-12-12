import { Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import React, { useContext } from 'react'
import cookieContext from '../../contexts/cookies.context'
import { AcceptButton, CookieContainer } from './styles'

export const CookiesPopup: React.FC = () => {
  const { allowCookies } = useContext(cookieContext)
  return (
    <CookieContainer>
      <Typography color="white" lineHeight={{ xs: 2, md: 3 }} textAlign="center" fontSize={16}>
        Este site está em conformidade com a Lei Geral de Proteção de Dados (LGPD) e utiliza cookies
        para oferecer uma melhor experiência ao visitante. Ao navegar em nosso site, você concorda
        com a utilização de cookies e com a nossa
        <RouterLink
          to="/politicas-de-privacidade"
          target={'_blank'}
          style={{ textDecorationColor: 'white' }}
        >
          <Typography
            ml={2}
            color="white"
            lineHeight={{ xs: 2, md: 3 }}
            fontSize={16}
            component="span"
          >
            Política de Privacidade.
          </Typography>
        </RouterLink>
      </Typography>
      <AcceptButton onClick={allowCookies}>Concordo</AcceptButton>
    </CookieContainer>
  )
}
