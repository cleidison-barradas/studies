import { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles } from '@material-ui/core'
import styles from './styles'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: () => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreProductsControlDialog extends Component<Props> {

  handleSubmit = async () => {
    const { onSubmit, setOpen } = this.props
    setOpen(false)
    await onSubmit()
  }

  render() {
    const { open, setOpen, classes, onSubmit } = this.props

    return (
      <Dialog onBackdropClick={() => setOpen(false)} open={open} maxWidth="md" fullWidth>

                  <DialogTitle>Atualizar Controles</DialogTitle>
                  <DialogContent
                      classes={{
                        root: classes.dialogContentRoot,
                      }}
                      >
                      <Box mb={2}>
                          <Box mb={2}>
                            <DialogContentText>Adiciona o campo "Controle" aos produtos da base da loja que não o possuem, mas existe controle em nossa base central.</DialogContentText>
                            <DialogContentText>OBS.: NÃO ATUALIZAR SEM AUTORIZAÇÃO PRÉVIA DA LOJA.</DialogContentText>
                          </Box>
                      </Box>
                    </DialogContent><DialogActions>
                    <Button color="default" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                    <Button color="primary" onClick={() => {
                        setOpen(false)
                        onSubmit()
                      }}
                      variant="contained">
                      Atualizar
                    </Button>
                  </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(StoreProductsControlDialog)
