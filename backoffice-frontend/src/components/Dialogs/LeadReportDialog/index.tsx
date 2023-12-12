import React, { Component } from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, withStyles } from '@material-ui/core'

import { LeadsReportRequest } from '../../../services/api/interfaces/ApiRequest'

import LeadReportForm from '../../Forms/LeadReportForm'

import styles from './styles'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: LeadsReportRequest) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class LeadReportDialog extends Component<Props> {
  initialValues: LeadsReportRequest = {
    startDate: null,
    endDate: null,
    colaborator: undefined,
    colaboratorCpf: undefined,
    colaboratorCnpj: undefined,
    colaboratorEmail: undefined,
    colaboratorPhone: undefined,
    status: undefined,
    sdrInfo: false,
  }

  handleSubmit = async (data: LeadsReportRequest) => {
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
                      <>
                        <Box mb={2}>
                          <DialogContentText>Gere um relatório podendo filtrar pelos dados do colaborador e pela data de cadastro dos Leads. Pode-se também gerar junto com os leads, os respectivos SDR's responsáveis. </DialogContentText>
                          <DialogContentText>Obs.: Caso os campos a baixo não forem preenchidos, será gerado um relatório com todos os leads cadastrados no momento.</DialogContentText>
                        </Box>
                        <LeadReportForm />
                      </>
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

export default withStyles(styles)(LeadReportDialog)
