import { Button, Dialog } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import { StartDocksModalProps } from './model'
import { StartDocksModalStyled } from './styles'

import stockWelcome from '../../assets/images/stockWelcome.svg'

export const StartDocksModal = ({ open, onToggle }: StartDocksModalProps) => {
  const history = useHistory()

  return (
    <Dialog open={open} onClose={() => onToggle(false)}>
      <StartDocksModalStyled>
        <img src={stockWelcome} alt="Bem-vindo" />

        <div>
          <h3>Chegou o Estoque Virtual!</h3>

          <p>Aumente suas Vendas com o estoque virtual</p>

          <strong>Veja como funciona:</strong>
        </div>

        <Button
          color="primary"
          onClick={() => {
            history.push('/appstore/virtualstock')
            onToggle(false)
          }}
          variant="contained"
        >
          Ok! Vamos ver!
        </Button>
      </StartDocksModalStyled>
    </Dialog>
  )
}
