import React, { useContext } from 'react'
import { WhatsappIcon } from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'
import { useGA } from '../../hooks/useGA'
import { useGA4 } from '../../hooks/useGA4'
import { Link } from './styles'

export const WhatsappButton: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { event } = useGA()
  const { eventGA4 } = useGA4()

  return (
    <Link
      color={'#51CF66'}
      rel="noopener noreferrer"
      onClick={() => {
        event('Contato', 'Click no botão do WhatsApp')
        eventGA4('Contato', 'Click no botão do WhatsApp')
      }}
      target="_blank"
      href={`https://api.whatsapp.com/send?phone=55${store?.settings.config_whatsapp_phone?.replace(
        /[^0-9]/g,
        ''
      )}&text=Olá, vim pelo site!`}
    >
      <WhatsappIcon height="100%" width="100%" />
    </Link>
  )
}
