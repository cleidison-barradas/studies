import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  withStyles,
} from '@material-ui/core'
import { Form, Formik } from 'formik'
import { Component } from 'react'
import ExportOrderForm from '../../Forms/ExportOrderForm'
import styles from './styles'
import { RequestReport } from '../../../services/api/interfaces/ApiRequest'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: RequestReport) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ExportOrderDialog extends Component<Props> {
  initialValues: RequestReport = {
    prefix: 'ecommerce',
    type: 'order',
    startAt: null,
    endAt: null,
    orderStatus: []
  }

  handleSubmit = async (data: RequestReport) => {
    const { onSubmit, setOpen } = this.props

    await onSubmit(data)
    setOpen(false)
  }

  render() {
    const { open, setOpen, classes } = this.props
    return (
      <Dialog onBackdropClick={() => setOpen(false)} fullWidth maxWidth="md" open={open}>
        <Formik
          enableReinitialize
          initialValues={this.initialValues}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => {

            return (
              <Form>
                <DialogTitle>Exportar Pedidos</DialogTitle>
                <DialogContent
                  classes={{
                    root: classes.dialogContentRoot,
                  }}
                >
                  <Box mb={2}>
                    {isSubmitting ? (
                      <Box>
                        <LinearProgress />
                        <Box mb={1}>
                          <DialogContentText align="center">Aguarde enquanto geramos o seu relatório</DialogContentText>
                        </Box>
                      </Box>
                    ) : (
                      <Box mt={2}>
                        <DialogContentText>
                          Exporte sua base de pedidos inteira ou filtre apenas os pedidos desejados usando os filtros abaixo.
                          <br />
                          Em caso de nenhuma data ou status selecionados, todos os pedidos serão selecionados.
                        </DialogContentText>
                        <ExportOrderForm />
                      </Box>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button disabled={isSubmitting} onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                    Gerar
                  </Button>
                </DialogActions>
              </Form>
            )
          }}
        </Formik>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ExportOrderDialog)
