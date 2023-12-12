import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import NewProductPaper from '../../components/Papers/NewProductPaper'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { ClassificationProvider, ClassificationConsumer } from '../../context/ClassificationContext'
import { ProductControlProvider, ProductControlConsumer } from '../../context/ControlsContext'
import { ManufacturerProvider, ManufacturerConsumer } from '../../context/ManufacturerContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import ImportData from '../../interfaces/importData'
import customerxService from '../../services/customerx.service'
import styles from './styles'

interface LocationProps {
  product: ImportData | null
}

interface Props extends RouteComponentProps<{}, {}, LocationProps> {
  mode: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class AddProduct extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const {
      mode,
      openSnackbar,
      location: { state },
    } = this.props

    return (
      <React.Fragment>
        <StoreProvider>
          <StoreConsumer>
            {({ store }) => (
              <ManufacturerProvider>
                <ClassificationProvider>
                  <CategoryProvider>
                    <ProductControlProvider>
                      <ProductProvider>
                        <ManufacturerConsumer>
                          {({ getManufacturers }) => (
                            <ClassificationConsumer>
                              {({ requestGetClassifications }) => (
                                <CategoryConsumer>
                                  {({ getCategorys }) => (
                                    <ProductControlConsumer>
                                      {({ requestGetProductControls }) => (
                                        <ProductConsumer>
                                          {({
                                            success,
                                            product,
                                            products,
                                            getProducts,
                                            requestAddProduct,
                                            requestGetProductDetail,
                                          }) => {
                                            return (
                                              <NewProductPaper
                                                mode={mode}
                                                store={store}
                                                success={success}
                                                product={product}
                                                products={products}
                                                importValue={state}
                                                getProducts={getProducts}
                                                loadCategories={getCategorys}
                                                loadManufacturers={getManufacturers}
                                                loadClassifications={requestGetClassifications}
                                                loadControls={requestGetProductControls}
                                                loadProductDetail={requestGetProductDetail}
                                                openSnackbar={openSnackbar}
                                                onSave={requestAddProduct}
                                              />
                                            )
                                          }}
                                        </ProductConsumer>
                                      )}
                                    </ProductControlConsumer>
                                  )}
                                </CategoryConsumer>
                              )}
                            </ClassificationConsumer>
                          )}
                        </ManufacturerConsumer>
                      </ProductProvider>
                    </ProductControlProvider>
                  </CategoryProvider>
                </ClassificationProvider>
              </ManufacturerProvider>
            )}
          </StoreConsumer>
        </StoreProvider>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(AddProduct)
