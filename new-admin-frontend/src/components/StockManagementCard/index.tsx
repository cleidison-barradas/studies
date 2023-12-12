/* tslint:disable */

import { Switch } from '../Switch'

import { StockManagementCardProps } from './model'
import { StockManagementCardStyled } from './styles'

export const StockManagementCard = (props: StockManagementCardProps) => {
  const { label, onChange, onCardToggle, channels, active } = props

  return (
    <StockManagementCardStyled {...props}>
      <div>
        <h1>{label}</h1>

        <div className="active">
          <Switch onChange={onCardToggle} checked={active} />

          {active ? 'Ativado' : 'Desativado'}
        </div>
      </div>

      <div>
        <p>Canais de vendas</p>

        <div className="group">
          {channels.map((channel) => (
            <div className="label">
              <Switch
                disabled={!active}
                checked={channel.value}
                blocked={channel.blocked}
                onChange={(e) =>
                  onChange(channels.map((chann) => (chann.name === channel.name ? { ...chann, value: e } : chann)))
                }
              />
              {channel.label}
            </div>
          ))}
        </div>
      </div>
    </StockManagementCardStyled>
  )
}
