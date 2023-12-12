import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, withStyles } from '@material-ui/core'
import styles from './styles'
import { Form, Formik } from 'formik'
import { RequestStoresReport } from '../../../services/api/interfaces/ApiRequest'
import StoresReportForm from '../../Forms/StoresReportForm'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: RequestStoresReport) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoresReportDialog extends Component<Props> {
  initialValues: RequestStoresReport = {
    orderLimit: null,
    startDate: null,
    endDate: null,
  }

  handleSubmit = async (data: RequestStoresReport) => {
    const { onSubmit, setOpen } = this.props

    await onSubmit(data)
    setOpen(false)
  }

  render() {
    const { open, setOpen, classes } = this.props
    return (
      <Dialog onBackdropClick={() => setOpen(false)} open={open} maxWidth="md" fullWidth>
        <Formik
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={this.initialValues}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <DialogTitle>Gerar Relatório</DialogTitle>
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
                          <DialogContentText align="center">Aguarde enquanto geramos o seu relatório...</DialogContentText>
                        </Box>
                      </Box>
                    ) : (
                      <Box mb={2}>
                        <DialogContentText>Gere um relatório das lojas podendo filtrar pela quantidade máxima de pedidos e/ou o período que ela foi criada. </DialogContentText>
                        <DialogContentText>Obs.: Caso os campos a baixo não forem preenchidos, será gerado um relatório com todas as lojas cadastradas no momento.</DialogContentText>
                        <StoresReportForm />
                      </Box>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button color="default" disabled={isSubmitting} onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" variant="contained">
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

export default withStyles(styles)(StoresReportDialog)
