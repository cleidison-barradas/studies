import React, { Component } from 'react'
import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

import CustomersPaper from '../../components/Papers/CustomersPaper'
import ImportCustomerModal from '../../components/ImportCustomerModal'
import ExportCustomerDialog from '../../components/Dialogs/ExportCustomerDialog'

import { ReportProvider } from '../../context/ReportContext'
import { CustomerConsumer, CustomerProvider } from '../../context/CustomerContext'
import { UploadContextConsumer, UploadContextProvider } from '../../context/UploadContext'

import customerxService from '../../services/customerx.service'

import style from './style'
import Plan from '../../interfaces/plan'

type Props = {
  plan: Plan
  classes: any
}

type State = {
  openModalImport: boolean
  openModalExport: boolean
}

interface IRequestImport {
  file: File | null,
  license: string
}

class Customers extends Component<Props, State> {
  state: State = {
    openModalExport: false,
    openModalImport: false
  }

  schemaValidation = yup.object({
    file: yup.mixed().required('Selecione um arquivo para enviar')
  })

  componentDidMount() {
    customerxService.trackingScreen()
  }

  setOpenExport = () => {
    this.setState((state) => ({
      ...state,
      openModalExport: !state.openModalExport
    }))
  }

  setOpenImport = () => {
    this.setState((state) => ({
      ...state,
      openModalImport: !state.openModalImport
    }))
  }
  handleSave = (values: IRequestImport, dispath: (data: IRequestImport) => Promise<void>) => {

    dispath(values)
    this.setOpenImport()
  }

  render() {
    const { classes, plan } = this.props
    const { openModalImport, openModalExport } = this.state

    return (
      <CustomerProvider>
        <CustomerConsumer>
          {({ customers, getCustomers, fetching, deleteCustomers, pagination }) => (
            <>
              <Box mb={3}>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <Typography className={classes.headertxt}>Clientes</Typography>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color='primary'
                          onClick={this.setOpenImport}
                        >
                          Importar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          classes={{
                            root: classes.exportbtn,
                          }}
                          onClick={this.setOpenExport}
                        >
                          Exportar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <ReportProvider>
                <ExportCustomerDialog setOpen={this.setOpenExport} open={openModalExport} />
              </ReportProvider>
              <UploadContextProvider>
                <UploadContextConsumer>
                  {({ requestPostImportCustomers }) => (
                    <Formik
                      enableReinitialize
                      validationSchema={this.schemaValidation}
                      initialValues={{
                        file: null,
                        license: 'donot_know',
                      }}
                      onSubmit={(values) => {
                        this.handleSave(values, requestPostImportCustomers)
                        getCustomers()
                      }}
                    >
                      {({ submitForm, resetForm, errors }) => (
                        <Form>
                          <ImportCustomerModal
                            errors={errors}
                            open={openModalImport}
                            plan={plan}
                            closeModal={() => {
                              resetForm()
                              this.setOpenImport()
                            }}
                            handleSubmit={submitForm}
                          />
                        </Form>
                      )}
                    </Formik>
                  )}
                </UploadContextConsumer>
              </UploadContextProvider>
              <CustomersPaper
                customers={customers}
                getCustomers={getCustomers}
                plan={plan}
                fetching={fetching}
                onDelete={deleteCustomers}
                total={pagination?.total || 0}
              />
            </>
          )}
        </CustomerConsumer>
      </CustomerProvider>
    )
  }
}

export default withStyles(style)(Customers)