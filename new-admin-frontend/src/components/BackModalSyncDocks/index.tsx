import { Button, Dialog } from '@material-ui/core'

import { BackModalSyncDocksStyled } from './styles'
import { BackModalSyncDocksProps } from './model'

import ghostError from '../../assets/images/ghostError.svg'

export const BackModalSyncDocks = ({ open, onToggle, onNext, onBack }: BackModalSyncDocksProps) => {
  return (
    <Dialog open={open} onClose={() => onToggle(false)}>
      <BackModalSyncDocksStyled>
        <img src={ghostError} alt="Error" />

        <div>
          <h1>Oh não!</h1>

          <p>Você chegou tão longe, não saia agora... Continue avançando.</p>

          <strong>Falta pouco!</strong>
        </div>

        <footer>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              onBack()
              onToggle(true)
            }}
          >
            Não quero avançar
          </Button>
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
