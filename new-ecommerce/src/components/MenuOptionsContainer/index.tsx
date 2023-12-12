import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import {
  CardIcon,
  ClockIcon,
  LocationIcon,
  PillIcon,
  TicketIcon,
  UserIcon,
  StoreIcon,
} from '../../assets/icons'
import { useTheme } from 'styled-components'
import { MenuOption } from '../MenuOption'
import AuthContext from '../../contexts/auth.context'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { PaymentOptionsContainer } from '../PaymentOptionsContainer'
import { DeliveryScheduleContainer } from '../DeliveryScheduleContainer'
import { ChangeStoreContainer } from '../ChangeStoreContainer'
import useSWR from 'swr'
import { storeGroup } from '../../services/store/store.service'

interface MenuOptionsContainerProps {
  handleClose: () => void
  setSelected: (selected?: React.ReactNode) => void
}

export const MenuOptionsContainer: React.FC<MenuOptionsContainerProps> = ({
  handleClose,
  setSelected,
}) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user, store } = useContext(AuthContext)
  const { color } = useTheme()

  const isGenericStore = store?.plan.rule.includes('generic')
  const aboutUsDescription = isGenericStore ? ( 'Conheça nossa loja' ) : ('Conheça nossa farmácia')

  const storeUrl = store?.url || null
  const { data } = useSWR(store? '/storeGroup' : undefined, ( ) => storeGroup(storeUrl))

  const navigateOptions = [
    {
      icon: <TicketIcon color={color.neutral.darkest} />,
      title: 'Pedidos',
      description: 'Acompanhar minha compra',
      onClick: () => {
        navigate('/pedidos')
        handleClose()
      },
      isPrivate: true,
    },
    {
      icon: <UserIcon color={color.neutral.darkest} />,
      title: 'Editar seus dados',
      description: 'Minhas informações',
      isPrivate: true,
      onClick: () => {
        navigate('/edit/profile')
        handleClose()
      },
    },
    {
      icon: <LocationIcon color={color.neutral.darkest} />,
      title: 'Editar endereços',
      description: 'Seus endereços salvos',
      isPrivate: true,
      onClick: () => {
        navigate('/user/address')
        handleClose()
      },
    },
    {
      icon: <PillIcon color={color.neutral.darkest} />,
      title: 'Sobre nós',
      description: aboutUsDescription,
      isPrivate: false,
      onClick: () => {
        navigate('/sobre')
        handleClose()
      },
    },
    {
      title: 'Formas de Pagamento',
      description: 'Como pagar minhas compras',
      icon: <CardIcon color={color.neutral.darkest} />,
      isPrivate: false,
      onClick: () => {
        setSelected(<PaymentOptionsContainer onClose={() => setSelected(undefined)} />)
      },
    },
    {
      onClick: () => {
        setSelected(<DeliveryScheduleContainer onClose={() => setSelected(undefined)} />)
      },
      title: 'Horários de Entrega',
      description: 'Para delivery local',
      icon: <ClockIcon color={color.neutral.darkest} />,
    },

    {
      title: 'Sair',
      isPrivate: true,
      onClick: logout,
      description: 'Sair da sua conta',
      icon: <PowerSettingsNewIcon />,
    },
  ]

  if (data!== undefined){
    if( (data.name === undefined || !data.name.includes('StoreNotFound'))){
      const changeFilial ={
          title: 'Trocar de Filial',
          description: 'Acesse outras lojas da rede',
          icon: <StoreIcon />,
          isPrivate: false,
          onClick: () => {
            setSelected(<ChangeStoreContainer  storeGroup = {data} onClose={() => setSelected(undefined)} />)
          },
        }
      navigateOptions.splice(navigateOptions.length-1, 0, changeFilial)
    }
  }

  return (
    <React.Fragment>
      {navigateOptions
        .filter(({ isPrivate }) => {
          if (isPrivate && user) return true
          if (isPrivate && !user) return false
          return true
        })
        .map(({ icon, title, description, onClick }, index) => (
          <MenuOption
            key={index}
            title={title}
            onClick={onClick}
            description={description}
            icon={icon}
          />
        ))}
    </React.Fragment>
  )
}
