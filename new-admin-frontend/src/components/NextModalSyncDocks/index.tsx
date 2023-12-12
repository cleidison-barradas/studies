import { Button, Dialog } from '@material-ui/core'

import { BackModalSyncDocksStyled } from './styles'
import { BackModalSyncDocksProps } from './model'

import pharmSuccess from '../../assets/images/pharmSuccess.svg'

export const NextModalSyncDocks = ({ open, label, onToggle, onNext }: BackModalSyncDocksProps) => {
  return (
    <Dialog open={open} onClose={() => onToggle(false)}>
      <BackModalSyncDocksStyled>
        <img src={pharmSuccess} alt="Success" />

        <div>
          <h1>Parabéns!</h1>

          <p>Você concluiu a {label} etapa da integração do estoque virtual. Agora continue avançando.</p>

          <strong>Falta pouco!</strong>
        </div>

        <footer>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onNext()
              onToggle(false)
            }}
          >
            Ok! Seguir em frente!
          </Button>
        </footer>
      </BackModalSyncDocksStyled>
    </Dialog>
  )
}
