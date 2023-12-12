import { Typography, Box } from '@mui/material'
import React, { useCallback, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import CartContext from '../../contexts/cart.context'
import { useAuth } from '../../hooks/useAuth'

const LoginSocialCallback: React.FC = () => {
  const { FacebookLogin, GoogleLogin } = useAuth()
  const { getProceedCheckout, setProceedCheckout } = useContext(CartContext)
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const handleCallback = useCallback(async () => {
    const code = params.get('code')
    const origin = params.get('origin')

    if (code && origin) {
      switch (origin) {
        case 'google':
          await GoogleLogin(code)

          break
        case 'facebook':
          await FacebookLogin(code)

          break
        default:
          navigate('/produtos')
          break
      }
      if (getProceedCheckout()) {
        setTimeout(() => {
          setProceedCheckout(false)
          navigate('/checkout')
        }, 1000)
      } else {
        setTimeout(() => {
          navigate('/produtos')
        }, 1000)
      }
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (params.has('error') || !params.has('code')) {
      return navigate('/produtos')
    }

    handleCallback()
  }, [params, navigate, handleCallback])

  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" marginTop={10}>
      <Typography>Autenticando aguarde...</Typography>
    </Box>
  )
}

export default LoginSocialCallback
