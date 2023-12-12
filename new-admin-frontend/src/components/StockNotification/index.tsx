import { Button } from '@material-ui/core'

import { StockNotificationProps } from './model'
import { StockNotificationStyled } from './styles'

import infoRed from '../../assets/images/infoRed.svg'

export const StockNotification = ({ items, onAction }: StockNotificationProps) => {
  return (
    <StockNotificationStyled>
      <div>
        <img src={infoRed} alt="AtençãoI" />
        <div>
          <h2>Atenção</h2>
          Você possui {items} ítens com falha.
        </div>
      </div>

      <Button color="primary" variant="contained" fullWidth onClick={onAction}>
        Corrigir agora
      </Button>
    </StockNotificationStyled>
  )
}
