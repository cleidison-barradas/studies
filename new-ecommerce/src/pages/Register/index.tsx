import { Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import { RegisterForm } from '../../forms/RegisterForm'

const Register: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Stack direction="row" pt={{ xs: 10, md: 5 }} pb={{ md: 5 }} justifyContent="center">
      <RegisterForm onReturn={() => navigate('/produtos')} onFinish={() => navigate('/produtos')} />
    </Stack>
  )
}

export default Register
