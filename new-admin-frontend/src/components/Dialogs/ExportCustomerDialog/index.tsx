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
import React, { Component } from 'react'
import ExportCustomerForm from '../../Forms/ExportCustomerForm'
import styles from './styles'
import { ReportConsumer } from '../../../context/ReportContext'
import { RequestReport } from '../../../services/api/interfaces/ApiRequest'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  open: boolean
  setOpen: (open?: boolean) => void
}

class ExportCustomerDialog extends Component<Props> {
  initialValues: RequestReport = {
    prefix: 'ecommerce',
    type: 'customer',
    startAt: null,
    endAt: null,
  }

  render() {
    const { open, setOpen, classes } = this.props
    return (
      <ReportConsumer>
        {({ requestgetReport }) => (
          <Dialog onBackdropClick={() => setOpen(false)} fullWidth maxWidth="md" open={open}>
            <Formik
              initialValues={this.initialValues}
              onSubmit={async (data) => {
                await requestgetReport(data)
                setOpen(false)
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <DialogTitle>Exportar clientes</DialogTitle>
                  <DialogContent
                    classes={{
                      root: classes.dialogContentRoot,
                    }}
                  >
                    <Box mb={2}>
                      {isSubmitting ? (
                        <React.Fragment>
                          <LinearProgress />
                          <Box mt={1}>
                            <DialogContentText align="center">Aguarde enquanto geramos o seu relatório</DialogContentText>
                          </Box>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <DialogContentText>
                            Exporte sua base de clientes inteira ou filtre apenas os clientes desejados usando os filtros abaixo.{' '}
                            <br />
                            Em caso de nenhuma data selecionada, todos os clientes serão selecionados
                          </DialogContentText>
                          <ExportCustomerForm />
                        </React.Fragment>
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
              )}
            </Formik>
          </Dialog>
        )}
      </ReportConsumer>
    )
  }
}

export default withStyles(styles)(ExportCustomerDialog)
