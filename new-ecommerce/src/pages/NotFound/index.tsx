import { Stack, Typography } from '@mui/material'
import React from 'react'
import { ReturnButton } from './styles'
import { BackArrowIcon } from '../../assets/icons'
import { useNavigate } from 'react-router'
import { AboutUsHelmet } from '../../components/AboutUsHelmet'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { grey } from '@mui/material/colors'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <AboutUsHelmet />
      <Stack mb={5} alignItems="center" mt={2} direction="row" spacing={2}>
        <ReturnButton onClick={() => navigate('/')}>
          <BackArrowIcon />
        </ReturnButton>
        <Typography variant="h1" color="#616D78" fontSize={{ lg: 30, xs: 18 }}>
          Não foi possível econtrar o que buscava.
        </Typography>
      </Stack>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1">
          Página não encontrada!
        </Typography>
        <ErrorOutlineIcon sx={{ fontSize: 300, color: grey[800]  }} />
        <Typography variant="body1" style={{ cursor: 'pointer' }} onClick={() => {navigate('/produtos')}}>
          Clique aqui para retornar ao início.
        </Typography>
      </div>
    </React.Fragment>
  )
}

export default NotFound
