import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import UpdateProductPaper from '../../components/Papers/UpdateProductPaper'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { ClassificationProvider, ClassificationConsumer } from '../../context/ClassificationContext'
import { ProductControlProvider, ProductControlConsumer } from '../../context/ControlsContext'
import { ManufacturerProvider, ManufacturerConsumer } from '../../context/ManufacturerContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'

import customerxService from '../../services/customerx.service'
import styles from './styles'

interface RouteParams {
  id: string
}

interface Props extends RouteComponentProps<RouteParams> {
  classes: Record<keyof ReturnType<typeof styles>, string>
  mode: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

class UpdateProduct extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
    window.scrollTo(0, 0)
  }

  render() {
    const {
      match: {
        params: { id },
      },
      mode,
      openSnackbar,
    } = this.props
    return (
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
                                          requestGetProductDetail,
                                          requestAlterProduct,
                                          products,
                                          success,
                                          product,
                                          fetching,
                                        }) => {
                                          return (
                                            <UpdateProductPaper
                                              mode={mode}
                                              fetching={fetching}
                                              products={products}
                                              getProduct={requestGetProductDetail}
                                              loadCategories={getCategorys}
                                              loadManufacturers={getManufacturers}
                                              loadClassifications={requestGetClassifications}
                                              loadControls={requestGetProductControls}
                                              loadProductDetail={requestGetProductDetail}
                                              openSnackbar={openSnackbar}
                                              success={success}
                                              store={store}
                                              id={id}
                                              product={product ? product : undefined}
                                              onSave={requestAlterProduct}
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
    )
  }
}

export default withStyles(styles)(UpdateProduct)
