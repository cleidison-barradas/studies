import { Stack, Typography, Button } from '@mui/material'
import { WhatsappIcon } from '../../assets/icons'
import { WhatsappButton } from './styles'
import { useNavigate } from 'react-router'
import { useContext } from 'react'
import AuthContext from '../../contexts/auth.context'

export const OrderHelpButtons = () => {
  const navigate = useNavigate()
  const { store } = useContext(AuthContext)

  return (
    <Stack alignItems="center" justifyContent="center" spacing={3}>
      <Stack>
        <Typography textAlign="center" fontWeight="bold">
          Precisa de ajuda?
        </Typography>
        <Typography fontWeight={400}>Fale com a gente pelo WhatsApp!</Typography>
      </Stack>

      <Stack width="100%" spacing={2} direction="row" justifyContent="center">
        <WhatsappButton
          rel="noopener noreferrer"
          target="_blank"
          href={`https://api.whatsapp.com/send?phone=55${store?.settings.config_whatsapp_phone?.replace(/[^0-9]/g, '')}`}
        >
          FALE COM A GENTE <WhatsappIcon />
        </WhatsappButton>
        <Button fullWidth variant="outlined" onClick={() => navigate('/produtos')}>
          CONTINUAR COMPRANDO
        </Button>
      </Stack>
    </Stack>
  )
}
