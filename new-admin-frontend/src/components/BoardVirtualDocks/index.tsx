/* tslint:disable */

import { useContext } from 'react'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router'

import { StockManagementCard } from '../StockManagementCard'
import { BoardVirtualDocksContext } from '../../context/BoardVirtualDocks'
import { StockManagementChannel } from '../StockManagementCard/model'
import { StockHelperCardProps } from '../StockHelperCard/model'
import { ThemeContext } from '../../context/ThemeContext'
import { ModalToggleStock } from '../ModalToggleStock'
import { StockHelperCard } from '../StockHelperCard'
import { ModalSyncStock } from '../ModalSyncStock'

import { BoardVirtualDocksStyled } from './styles'

import orderBoard from '../../assets/images/orderBoard.svg'
import markupBoard from '../../assets/images/markupBoard.svg'
import rocketBoard from '../../assets/images/rocketBoard.svg'
import helperBoard from '../../assets/images/helperBoard.svg'
import infoBlue from '../../assets/images/infoBlue.svg'
import infoRed from '../../assets/images/infoRed.svg'
import { StockNotification } from '../StockNotification'

export const BoardVirtualDocks = () => {
  const { push } = useHistory()

  const {
    virtual,
    setVirtual,
    physical,
    virtualPrevent,
    setVirtualPrevent,
    onActiveVirtual,
    countFailedItems,
    onDisableVirtual,
    progress,
    setPhysical,
    setSynchronize,
    synchronize,
  } = useContext(BoardVirtualDocksContext)
  const { mode } = useContext(ThemeContext)

  const onChangeVirtualChannels = (_channels: StockManagementChannel[]) => setVirtual({ ...virtual })
  const onChangePhysicalChannels = (_channels: StockManagementChannel[]) => setPhysical({ ...physical })

  const helpers: StockHelperCardProps[] = [
    {
      icon: markupBoard,
      name: 'Configurar Markup',
      description: 'Seu markup para o Estoque Virtual está configurado para operar em 25%.',
      onAction: () => {},
      action: 'Configurar Markup',
    },
    {
      action: 'Acessar pedidos',
      description: 'Acesse sua área padrão de pedidos para aprovar as compras e entregas do estoque virtual',
      icon: orderBoard,
      name: 'Gerenciar pedidos',
      onAction: () => push('/sales/list'),
    },
    {
      action: 'Configurar e gerenciar produtos',
      description: 'Acesse sua área de gestão de produtos para editar e configurar produtos.',
      icon: rocketBoard,
      name: 'Configurar e gerencia produtos',
      onAction: () => push('/products'),
    },
    {
      action: 'Precisa de ajuda?',
      description: 'Acesse uma área completa com todos os assuntos do estoque virtual para te ajudar em cada etapa.',
      icon: helperBoard,
      name: 'Acessar central de ajuda.',
      onAction: () => window.open('https://mypharmasupport.zendesk.com/hc/pt-br', '_blank'),
    },
  ]

  const onToggleVirtual = (value: boolean) => {
    setVirtual({ ...virtual, active: value })
    setVirtualPrevent({ ...virtualPrevent, [value ? 'active' : 'disable']: false })

    value ? onActiveVirtual() : onDisableVirtual()
  }

  return (
    <BoardVirtualDocksStyled mode={mode}>
      {countFailedItems > 0 && <StockNotification items={countFailedItems} onAction={() => push('/products')} />}

      <header>
        <div>
          <h1>Estoque Virtual</h1>
          <p>Configurações básicas</p>
        </div>

        <Button onClick={() => setSynchronize({ ...synchronize, open: true, loading: true })} variant="contained" color="primary">
          Sincronizar estoque
        </Button>
      </header>

      <ModalSyncStock
        {...synchronize}
        progress={progress}
        onChange={() => setSynchronize({ ...synchronize, open: false })}
        onFinish={() => setSynchronize({ ...synchronize, open: false })}
        onSyncronize={() => {}}
      />

      <ModalToggleStock
        open={virtualPrevent.disable}
        onChange={(e) => setVirtualPrevent({ ...virtualPrevent, disable: e })}
        onCancel={() => onToggleVirtual(false)}
        onConfirm={() => setVirtualPrevent({ ...virtualPrevent, disable: false })}
        variant="warning"
        cancelAction="Ok, desativar"
        confirmAction="Manter ativo"
        description="Ao desativar a função estoque virtual, você irá automaticamente remover todos os 15 mil ítens disponíveis aos canais de vendas ativados."
        icon={infoRed}
        name="Atenção!"
      />

      <ModalToggleStock
        open={virtualPrevent.active}
        onChange={(e) => setVirtualPrevent({ ...virtualPrevent, active: e })}
        variant="default"
        onConfirm={() => onToggleVirtual(true)}
        onCancel={() => setVirtualPrevent({ ...virtualPrevent, active: false })}
        cancelAction="Cancelar"
        confirmAction="Ok, ativar"
        description="Ao ativar esta função estoque virtual, você irá automaticamente mostrar novos 15 mil ítens disponíveis aos canais de vendas ativados."
        icon={infoBlue}
        name="Atenção!"
      />

      <div className="wrapper">
        <StockManagementCard
          channels={virtual.channels}
          label="Status do estoque virtual"
          active={virtual.active}
          onChange={onChangeVirtualChannels}
          name="virtual"
          onCardToggle={(e) => setVirtualPrevent({ ...virtualPrevent, [e ? 'active' : 'disable']: true })}
        />
        <StockManagementCard
          channels={physical.channels}
          label="Status do estoque físico"
          active
          onChange={onChangePhysicalChannels}
          name="virtual"
          onCardToggle={(_value) => setPhysical({ ...physical })}
        />

        {helpers.map((helper) => (
          <StockHelperCard key={Math.random()} {...helper} />
        ))}
      </div>
    </BoardVirtualDocksStyled>
  )
}
