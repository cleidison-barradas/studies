import { Button, CircularProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import PaperBlock from '../../PaperBlock'
import EditProductTable from '../../Tables/EditProductTable'
import styles from './styles'

import { ReactComponent as BackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import Product from '../../../interfaces/product'
import ProductsFieldsForm from '../../Forms/ProductsFieldsForm'
import { ClassificationConsumer } from '../../../context/ClassificationContext'
import { ProductControlConsumer } from '../../../context/ControlsContext'
import { ManufacturerConsumer } from '../../../context/ManufacturerContext'
import { CategoryConsumer } from '../../../context/CategoryContext'
import { Form, Formik } from 'formik'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  requestAlterProduct: (payload: Product | Product[]) => Promise<void>
  products: Product[]
}

interface State {
  products: Product[]
  fields: string[]
  availableFields: string[]
}

class EditProductsPaper extends Component<Props, State> {
  state: State = {
    products: [],
    fields: [],
    availableFields: ['category', 'classification', 'price', 'control', 'manufacturer'],
  }

  componentDidMount() {
    const { products } = this.props
    this.setState({
      ...this.state,
      products,
    })
  }

  addField = (field: string) => {
    const fields = [...this.state.fields, field]
    this.setState({
      ...this.state,
      fields,
    })
  }

  removeField = (field: string) => {
    const fields = this.state.fields.filter((value: string) => value !== field)
    this.setState({
      ...this.state,
      fields,
    })
  }

  save = async (products: Product[]) => {
    const { requestAlterProduct, history } = this.props
    await requestAlterProduct(products)
    history.goBack()
  }

  render() {
    const { classes } = this.props
    const { fields, availableFields, products } = this.state
    return (
      <Formik initialValues={products} enableReinitialize onSubmit={this.save}>
        {({ setFieldValue, isSubmitting, dirty }) => (
          <Form>
            <div>
              <div className={classes.backrow}>
                <div className={classes.row}>
                  <Link to="/products" className={classes.backlink}>
                    <BackArrow />
                  </Link>
                  <Typography className={classes.backtext}>Editor em massa</Typography>
                </div>
                <div className={classes.row}>
                  <Button className={classes.button}>Descartar</Button>
                  <Button
                    disabled={isSubmitting || dirty}
                    color="primary"
                    variant="contained"
                    className={classes.savebutton}
                    type="submit"
                  >
                    {isSubmitting ? <CircularProgress color="secondary" size={20} /> : 'SALVAR'}
                  </Button>
                </div>
              </div>
              <PaperBlock title={'Campos em edição'}>
                <ProductsFieldsForm
                  fields={fields}
                  availableFields={availableFields}
                  addField={this.addField}
                  removeField={this.removeField}
                />
                <ManufacturerConsumer>
                  {({ getManufacturers, manufacturers, fetching: fetchingManufacturers }) => (
                    <ProductControlConsumer>
                      {({ requestGetProductControls, productControls }) => (
                        <CategoryConsumer>
                          {({ getCategorys, fetching: fetchingCategorys, categorys }) => (
                            <ClassificationConsumer>
                              {({ requestGetClassifications, classifications }) => (
                                <EditProductTable
                                  fields={fields}
                                  products={products}
                                  controls={productControls}
                                  manufacturers={manufacturers}
                                  classifications={classifications}
                                  setProducts={(newProducts: any) => setFieldValue('products', newProducts)}
                                  loadManufacturers={getManufacturers}
                                  loadControls={requestGetProductControls}
                                  loadClassifications={requestGetClassifications}
                                  loadCategorys={getCategorys}
                                  fetchingCategorys={fetchingCategorys}
                                  fetchingManufacturers={fetchingManufacturers}
                                  categorys={categorys}
                                />
                              )}
                            </ClassificationConsumer>
                          )}
                        </CategoryConsumer>
                      )}
                    </ProductControlConsumer>
                  )}
                </ManufacturerConsumer>
              </PaperBlock>
            </div>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(EditProductsPaper)
