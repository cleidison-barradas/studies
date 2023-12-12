import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Product from '../../interfaces/product'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { ProductControlProvider } from '../../context/ControlsContext'
import { ManufacturerProvider } from '../../context/ManufacturerContext'
import { ClassificationProvider } from '../../context/ClassificationContext'

import styles from './style'
import EditProductsPaper from '../../components/Papers/EditProductsPaper'
import { RouteComponentProps } from 'react-router-dom'
import { CategoryProvider } from '../../context/CategoryContext'
import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps<{}, {}, LocationParams> {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface LocationParams {
  products: Product[]
}

class EditProducts extends Component<Props> {

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const props = this.props
    const {
      location: {
        state: { products },
      },
    } = props
    return (
      <ProductProvider>
        <ManufacturerProvider>
          <ProductControlProvider>
            <ClassificationProvider>
              <CategoryProvider>
                <ProductConsumer>
                  {({ requestAlterProduct }) => (
                    <EditProductsPaper products={products} requestAlterProduct={requestAlterProduct} {...props} />
                  )}
                </ProductConsumer>
              </CategoryProvider>
            </ClassificationProvider>
          </ProductControlProvider>
        </ManufacturerProvider>
      </ProductProvider>
    )
  }
}
export default withStyles(styles)(EditProducts)
