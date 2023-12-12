import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ProductsPaper from '../../components/Papers/ProductsPaper'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import styles from './styles'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class Products extends Component<Props> {
  render() {
    const { classes, ...props } = this.props
    return (
      <CategoryProvider>
        <ProductProvider>
          <CategoryConsumer>
            {({ categories, getCategory }) => (
              <ProductConsumer>
                {({ products, getProducts, pagination, deleteProduct, fetching }) => (
                  <React.Fragment>
                    <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                      <LinearProgress />
                    </Box>
                    <ProductsPaper
                      {...props}
                      products={products}
                      categories={categories}
                      pagination={pagination}
                      getProduct={getProducts}
                      getCategory={getCategory}
                      deleteProduct={deleteProduct}
                    />
                  </React.Fragment>
                )}
              </ProductConsumer>
            )}
          </CategoryConsumer>
        </ProductProvider>
      </CategoryProvider>
    )
  }
}

export default withStyles(styles)(Products)
