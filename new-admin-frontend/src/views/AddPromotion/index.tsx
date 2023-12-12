import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import NewPromotionPaper from '../../components/Papers/NewPromotionsPaper'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ClassificationConsumer, ClassificationProvider } from '../../context/ClassificationContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { ProductPromotionProvider, ProductPromotionConsumer } from '../../context/ProductPromotionContext'


import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps {
  mode: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

class AddPromotion extends Component<Props> {
  handleSave = (data: any, dispatch: (data: any) => void) => {
    dispatch(data)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { mode, history } = this.props
    return (
      <ProductPromotionProvider>
        <ProductProvider>
          <CategoryProvider>
            <ClassificationProvider>
              <ProductPromotionConsumer>
                {({ requestAddProductPromotions, promotion }) => (
                  <ProductConsumer>
                    {({ getProducts, products, fetching }) => (
                      <CategoryConsumer>
                        {({ categorys, getCategorys }) => (
                          <ClassificationConsumer>
                            {({ classifications, requestGetClassifications }) => (
                              <NewPromotionPaper
                                {...this.props}
                                mode={mode}
                                history={history}
                                fetching={fetching}
                                products={products}
                                promotion={promotion}
                                loadProducts={getProducts}
                                onSave={requestAddProductPromotions}
                                loadCategories={getCategorys}
                                categories={categorys}
                                loadClassifications={requestGetClassifications}
                                classifications={classifications}
                              />
                            )}
                          </ClassificationConsumer>
                        )}
                      </CategoryConsumer>
                    )}
                  </ProductConsumer>
                )}
              </ProductPromotionConsumer>
            </ClassificationProvider>
          </CategoryProvider>
        </ProductProvider>
      </ProductPromotionProvider>
    )
  }
}

export default AddPromotion