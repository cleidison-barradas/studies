import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import ImportingHistoryPaper from '../../components/Papers/ImportingHistoryPaper'
import { XlsImportConsumer, XlsImportProvider } from '../../context/XlsImporterContext'
import ImportModal from '../../components/ImportModal'
import ImportPromotionModal from '../../components/ImportPromotionModal'
import { Form, Formik } from 'formik'
import customerxService from '../../services/customerx.service'
import { PutImportProduct, PutImportPromotion } from '../../services/api/interfaces/ApiRequest'
import style from './style'
import * as yup from 'yup'
import { SnackbarConsumer } from '../../context/SnackbarContext'

type Props = {
  mode: any
  classes: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

type State = {
  importProduct: boolean
  importPromotion: boolean
}

class ImportingHistory extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      importProduct: false,
      importPromotion: false
    }

    this.changeModalPromotion = this.changeModalPromotion.bind(this)
    this.changeModalProduct = this.changeModalProduct.bind(this)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  changeModalProduct() {
    this.setState({
      ...this.state,
      importProduct: !this.state.importProduct,
    })
  }

  changeModalPromotion() {
    this.setState({
      ...this.state,
      importPromotion: !this.state.importPromotion,
    })
  }

  handleSubmitProduct = (
    values: PutImportProduct,
    dispatch: (data: PutImportProduct) => void,
    callback: () => void,
    openSnackBar: (msg: string, severity?: 'error' | 'info' | 'success' | 'warning') => void,
    success = false
  ) => {
    dispatch(values)

    if (success) {
      openSnackBar('Dados enviados com sucesso !')
    } else {
      openSnackBar('Ocorreu um erro tente novamente mais tarde', 'error')
    }

    setTimeout(() => {
      callback()
      this.changeModalProduct()
    }, 800)

  }

  handleSubmitPromotion = (
    values: PutImportPromotion,
    dispatch: (data: PutImportPromotion) => void,
    callback: () => void,
    openSnackBar: (msg: string, severity?: 'error' | 'info' | 'success') => void,
    success = false
  ) => {
    dispatch(values)

    if (success) {
      openSnackBar('Dados enviados com sucesso !')
    } else {
      openSnackBar('Ocorreu um erro tente novamente mais tarde', 'error')
    }

    setTimeout(() => {
      callback()
      this.changeModalPromotion()
    }, 800)
  }

  validateSchemaProduct = yup.object().shape({
    file: yup.mixed().required('Selecione um arquivo para enviar').nullable(true),
    updateProduct: yup.boolean(),
  })

  validateSchemaPromotion = yup.object().shape({
    file: yup.mixed().required('Selecione um arquivo para enviar').nullable(true),
    date_start: yup.date().required('Data de inicio obrigatoria').nullable(true),
    date_end: yup.date().default(new Date())
      .min(yup.ref('date_start'), "Data inicial deve ser menor que data final")
      .required('Data de finalização Obrigatória').nullable(true),
  })

  render() {
    const { classes } = this.props
    return (
      <XlsImportProvider>
        <XlsImportConsumer>
          {({
            history,
            success,
            fetching,
            pagination,
            importHistory,
            requestGetImportHistory,
            requestPutImportProducts,
            requestPutImportPromotions,
            requestDeleteProductsImported,
          }) => (
            <SnackbarConsumer>
              {({ openSnackbar }) => (
                <>
                  <Box mb={2}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Typography className={classes.headertxt}>Histórico de Importação</Typography>
                      </Grid>
                      <Grid item>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Button variant="contained"
                              className={classes.tbutton}
                              onClick={this.changeModalPromotion}
                            >
                              IMPORTAR PROMOÇÕES
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button color="primary"
                              variant="contained"
                              onClick={this.changeModalProduct}
                            >
                              IMPORTAR PRODUTOS
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                  <ImportingHistoryPaper
                    fetching={fetching}
                    importDetail={history}
                    pagination={pagination}
                    importHistory={importHistory}
                    loadHistory={requestGetImportHistory}
                    onDelete={requestDeleteProductsImported}
                  />
                  {this.state.importProduct && (
                    <Formik
                      onSubmit={(values: any) => {
                        this.handleSubmitProduct(values,
                          requestPutImportProducts,
                          requestGetImportHistory,
                          openSnackbar, success)
                      }
                      }
                      initialValues={{ file: null, updateProduct: false }}
                      validationSchema={this.validateSchemaProduct}
                      enableReinitialize
                    >
                      {({ submitForm }) => (
                        <Form>
                          <ImportModal
                            onSave={submitForm}
                            open={this.state.importProduct}
                            openSnackbar={openSnackbar}
                            closeModal={this.changeModalProduct}
                          />
                        </Form>
                      )}
                    </Formik>
                  )}
                  {this.state.importPromotion && (
                    <Formik
                      onSubmit={(values: any) => {
                        this.handleSubmitPromotion(values,
                          requestPutImportPromotions,
                          requestGetImportHistory,
                          openSnackbar, success)
                      }
                      }
                      initialValues={
                        {
                          file: null,
                          date_start: null,
                          date_end: null
                        }
                      }
                      validationSchema={this.validateSchemaPromotion}
                      enableReinitialize
                    >
                      {({ submitForm, errors }) => (
                        <Form>
                          <ImportPromotionModal
                            errors={errors}
                            onSave={submitForm}
                            open={this.state.importPromotion}
                            openSnackbar={openSnackbar}
                            closeModal={this.changeModalPromotion}
                          />
                        </Form>
                      )}
                    </Formik>
                  )}
                </>
              )}
            </SnackbarConsumer>
          )}
        </XlsImportConsumer>
      </XlsImportProvider>
    )
  }
}

export default withStyles(style)(ImportingHistory)
