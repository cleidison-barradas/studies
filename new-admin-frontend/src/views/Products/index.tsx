// tslint:disable: no-shadowed-variable
import { Box, Button, LinearProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

import Product from '../../interfaces/product'

import PaperBlock from '../../components/PaperBlock'
import CustomDialog from '../../components/CustomDialog'
import ProductsTable from '../../components/Tables/ProductsTable'
import ExportModalContent from '../../components/ExportModalContent'
import ImportPromotionModal from '../../components/ImportPromotionModal'

import { FileProvider } from '../../context/FileContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { XlsImportConsumer, XlsImportProvider } from '../../context/XlsImporterContext'
import { ManufacturerProvider, ManufacturerConsumer } from '../../context/ManufacturerContext'
import { ProductControlProvider, ProductControlConsumer } from '../../context/ControlsContext'
import { ClassificationProvider, ClassificationConsumer } from '../../context/ClassificationContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'

import customerxService from '../../services/customerx.service'
import { PutImportPromotion } from '../../services/api/interfaces/ApiRequest'
import { ReactComponent as GoToIcon } from '../../assets/images/blueGoTo.svg'
import style from './style'
import { NotificationConsumer } from '../../context/NotificationContext'

interface Props extends RouteComponentProps {
  classes: any
  mode: any
  history: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

type Modal = {
  title: string
  content: any
  footer: any
  open: boolean
}

type filter = {
  name: string
  category: string
  manufacturer: string
}

type State = {
  modal: Modal
  selectedProducts: Product[]
  filteredProducts: Product[]
  filters: filter
  importing: boolean
  products: Product[]
}

class Products extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      modal: {
        title: '',
        content: () => '',
        footer: () => '',
        open: false,
      },
      products: [],
      filters: {
        category: '',
        name: '',
        manufacturer: '',
      },
      filteredProducts: [],
      selectedProducts: [],
      importing: false,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setModal = this.setModal.bind(this)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  onLoad = (dispatch: (data?: any) => void) => {
    const {
      match: {
        params: { productId },
      },
    }: any = this.props
    if (productId) {
      dispatch(productId)
    }
  }

  setModal(modal: Modal) {
    this.setState({
      modal,
    })
  }

  openModal(type: string) {
    const { selectedProducts, filteredProducts } = this.state
    const { classes, openSnackbar } = this.props

    const modal: Modal = {
      title: '',
      content: () => '',
      footer: () => '',
      open: true,
    }

    let save: any
    let cancel: any

    switch (type) {
      case 'export':
        save = () => {
          openSnackbar('Produtos importados com sucesso')
          this.closeModal()
        }
        cancel = () => {
          this.closeModal()
        }
        modal.title = 'Exportar produtos'
        modal.content = () => <ExportModalContent selectedProducts={selectedProducts} filteredProducts={filteredProducts} />
        modal.footer = () => (
          <div className={classes.footer}>
            <Link to="" className={classes.link}>
              <GoToIcon fill={'#ccc'} />
              <Typography color="inherit">Precisa de ajuda?</Typography>
            </Link>
            <div className={classes.btngroup}>
              <Button variant="outlined" onClick={cancel}>
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={save}>
                Salvar
              </Button>
            </div>
          </div>
        )
        break
      case 'import':
        this.setState({
          ...this.state,
          modal: {
            ...this.state.modal,
            open: true,
          },
          importing: true,
        })
        break
    }
  }

  closeModal() {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        open: false,
      },
      importing: false,
    })
  }

  schemaValidate = yup.object().shape({
    file: yup.mixed().required('Selecione um arquivo para enviar').nullable(true),
    date_start: yup.date().required('Data de inicio obrigatória').nullable(true),
    date_end: yup.date().default(new Date())
      .min(yup.ref('date_start'), "Data inicial deve ser menor que data final")
      .required('Data de finalização Obrigatória').nullable(true),
  })

  handleSave = (
    data: PutImportPromotion,
    dispatch: (values: PutImportPromotion) => void,
    openSnackbar: (msg: string, severity?: 'error' | 'info' | 'success' | 'warning') => void,
    success = false
  ) => {
    dispatch(data)

    openSnackbar('Dados envidos com sucesso !')
    this.closeModal()
  }

  render() {
    const { classes, mode } = this.props
    const { modal, importing } = this.state

    return (
      <React.Fragment>
        <ManufacturerProvider>
          <ClassificationProvider>
            <CategoryProvider>
              <ProductControlProvider>
                <ProductProvider>
                  <FileProvider>
                    <ManufacturerConsumer>
                      {({ getManufacturers, manufacturers }) => (
                        <ClassificationConsumer>
                          {({ requestGetClassifications, classifications }) => (
                            <CategoryConsumer>
                              {({ getCategorys, categorys }) => (
                                <ProductControlConsumer>
                                  {({ requestGetProductControls, productControls: controls }) => (
                                    <ProductConsumer>
                                      {({ getProducts, getVirtualProducts, requestUpdateCategory, requestUpdateStatus, requestDeleteProduct, requestAlterVirtualProduct, products, virtualProducts, fetching, pagination, success }) => (
                                        <Box>
                                          <div className={classes.headerrow}>
                                            <Typography className={classes.headertitle}>Produtos</Typography>
                                            <div className={classes.buttongroup}>
                                              <Button
                                                variant="contained"
                                                className={classes.tbutton}
                                                onClick={() => this.openModal('import')}
                                              >
                                                IMPORTAR PROMOÇÕES
                                              </Button>
                                              <Link className={classes.obutton} to={`/products/mockups`}>
                                                Atualizar imagens de produtos tarjados
                                              </Link>
                                              <Link className={classes.obutton} to={`/products/add`}>
                                                Cadastrar produto
                                              </Link>
                                            </div>
                                          </div>
                                          {fetching && (
                                            <Box mb={3}>
                                              <LinearProgress />
                                            </Box>
                                          )}
                                          <PaperBlock>
                                            <SnackbarConsumer>
                                            {({ openSnackbar }) => (
                                              <NotificationConsumer>
                                                {({ notification, getAdminNotification, pagination: notificationPagination  }) => (
                                                  <ProductsTable
                                                    {...this.props}
                                                    fetching={fetching}
                                                    products={products}
                                                    virtualProducts={virtualProducts}
                                                    controls={controls}
                                                    categories={categorys}
                                                    pagination={pagination}
                                                    notificationPagination={notificationPagination}
                                                    manufacturers={manufacturers}
                                                    classifications={classifications}
                                                    loadProducts={getProducts}
                                                    loadVirtualProducts={getVirtualProducts}
                                                    loadCategories={getCategorys}
                                                    onDelete={requestDeleteProduct}
                                                    loadManufacturers={getManufacturers}
                                                    onUpdateStatus={requestUpdateStatus}
                                                    loadControls={requestGetProductControls}
                                                    onUpdateCategories={requestUpdateCategory}
                                                    loadClassifications={requestGetClassifications}
                                                    updateDocasProduct={requestAlterVirtualProduct}
                                                    notification={notification}
                                                    getAdminNotification={getAdminNotification}
                                                    success={success}
                                                    openSnackbar={openSnackbar}
                                                    mode={mode}
                                                  />
                                                )}
                                              </NotificationConsumer>
                                              )}
                                            </SnackbarConsumer>
                                          </PaperBlock>
                                        </Box>
                                      )}
                                    </ProductConsumer>
                                  )}
                                </ProductControlConsumer>
                              )}
                            </CategoryConsumer>
                          )}
                        </ClassificationConsumer>
                      )}
                    </ManufacturerConsumer>
                  </FileProvider>
                </ProductProvider>
              </ProductControlProvider>
            </CategoryProvider>
          </ClassificationProvider>
        </ManufacturerProvider>

        <CustomDialog {...modal} closeModal={this.closeModal} />
        {importing && (
          <XlsImportProvider>
            <XlsImportConsumer>
              {({ requestPutImportPromotions, success }) => (
                <SnackbarConsumer>
                  {({ openSnackbar }) => (
                    <Formik
                      onSubmit={(values: any) => this.handleSave(values, requestPutImportPromotions, openSnackbar, success)}
                      initialValues={{
                        file: null,
                        date_start: null,
                        date_end: null,
                      }}
                      validationSchema={this.schemaValidate}
                      enableReinitialize
                    >
                      {({ submitForm, errors }) => (
                        <Form>
                          <ImportPromotionModal
                            open={this.state.modal.open}
                            openSnackbar={openSnackbar}
                            closeModal={this.closeModal}
                            onSave={submitForm}
                            errors={errors} />
                        </Form>
                      )}
                    </Formik>
                  )}
                </SnackbarConsumer>
              )}
            </XlsImportConsumer>
          </XlsImportProvider>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Products)
