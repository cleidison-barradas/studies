import React, { Component } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, withStyles } from '@material-ui/core'
import styles from './styles'
import { Form, Formik } from 'formik'
import { RequestGMVReport } from '../../../services/api/interfaces/ApiRequest'
import GMVReportForm from '../../Forms/GMVReportForm'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: RequestGMVReport) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class GMVReportDialog extends Component<Props> {

  initialValues: RequestGMVReport = {
    origin: 'all',
    startDate: new Date(),
    endDate: new Date(),
  }

  handleSubmit = async (data: RequestGMVReport) => {
    const { onSubmit, setOpen } = this.props

    await onSubmit(data)
    setOpen(false)
  }

  render() {
    const { open, setOpen, classes } = this.props
    return (
      <Dialog onBackdropClick={() => setOpen(false)} open={open} maxWidth="md" fullWidth>
        <DialogTitle>Relatório GMV</DialogTitle>
        <Formik
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={this.initialValues}
        >
          {({ isSubmitting }) => (
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
                      <DialogContentText>Gere um relatório dos totalizadores GMV de todas as lojas por período e por origem dos pedidos. </DialogContentText>
                      <GMVReportForm />
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
          )}
        </Formik>
      </Dialog>
    )
  }
}

export default withStyles(styles)(GMVReportDialog)
