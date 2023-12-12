import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import EditProductPromotionPaper from '../../components/Papers/UpdateProductPromotionPaper'
import { ProductPromotionProvider, ProductPromotionConsumer } from '../../context/ProductPromotionContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import { withStyles } from '@material-ui/core'
import style from './style'
import customerxService from '../../services/customerx.service'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ClassificationConsumer, ClassificationProvider } from '../../context/ClassificationContext'

interface RouteParams {
  promotionId: string
}

interface Props extends RouteComponentProps<RouteParams> {
  mode: any
  classes: any
}

class UpdateProductPromotion extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const {
      mode,
      history,
      classes,
      match: {
        params: { promotionId },
      },
    } = this.props

    return (
      <div>
        <ProductPromotionProvider>
          <ProductProvider>
            <CategoryProvider>
              <ClassificationProvider>
                <ProductPromotionConsumer>
                  {({ requestGetProductPromotions, requestAddProductPromotions, promotion, success }) => (
                    <ProductConsumer>
                      {({ getProducts, products, fetching }) => (
                        <CategoryConsumer>
                          {({ categorys, getCategorys }) => (
                            <ClassificationConsumer>
                              {({ classifications, requestGetClassifications }) => (
                                <EditProductPromotionPaper
                                  {...this.props}
                                  mode={mode}
                                  classes={classes}
                                  history={history}
                                  success={success}
                                  fetching={fetching}
                                  products={products}
                                  promotion={promotion}
                                  promotionId={promotionId}
                                  loadProducts={getProducts}
                                  onEdit={requestAddProductPromotions}
                                  loadPromotion={requestGetProductPromotions}
                                  loadCategories={getCategorys}
                                  loadClassifications={requestGetClassifications}
                                  classifications={classifications}
                                  categories={categorys}
                                />
                              )}
                            </ClassificationConsumer>
                          )}
                        </CategoryConsumer>
                      )
                      }
                    </ProductConsumer>
                  )}
                </ProductPromotionConsumer>
              </ClassificationProvider>
            </CategoryProvider>
          </ProductProvider>
        </ProductPromotionProvider>
      </div>
    )
  }
}

export default withStyles(style)(UpdateProductPromotion)