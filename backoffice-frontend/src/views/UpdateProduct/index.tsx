import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import UpdateProductPaper from '../../components/Papers/UpdateProductPaper'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ManufacturerConsumer, ManufacturerProvider } from '../../context/ManufacturerContext'
import { ControlConsumer, ControlProvider } from '../../context/ControlContext'
import { ClassificationConsumer, ClassificationProvider } from '../../context/ClassificationContext'

interface RouteParams {
  productId: string
}

interface Props extends RouteComponentProps<RouteParams> {}

class UpdateProductView extends Component<Props> {
  render() {
    const {
      match: {
        params: { productId },
      },
    } = this.props

    return (
      <ProductProvider>
        <CategoryProvider>
          <ManufacturerProvider>
            <ClassificationProvider>
              <ControlProvider>
                <ProductConsumer>
                  {({ getProductDetail, updateProduct, product, fetching = false }) => (
                    <CategoryConsumer>
                      {({ getCategory, categories }) => (
                        <ManufacturerConsumer>
                          {({ getManufacturer, manufacturers }) => (
                            <ClassificationConsumer>
                              {({ getClassifications, classifications }) => (
                                <ControlConsumer>
                                  {({ getControls, controls }) => (
                                    <UpdateProductPaper
                                      product={product}
                                      fetching={fetching}
                                      controls={controls}
                                      productId={productId}
                                      categories={categories}
                                      manufacturers={manufacturers}
                                      classifications={classifications}
                                      onUpdate={updateProduct}
                                      loadControl={getControls}
                                      loadCategory={getCategory}
                                      loadProduct={getProductDetail}
                                      loadManufacturer={getManufacturer}
                                      loadClassification={getClassifications}
                                    />
                                  )}
                                </ControlConsumer>
                              )}
                            </ClassificationConsumer>
                          )}
                        </ManufacturerConsumer>
                      )}
                    </CategoryConsumer>
                  )}
                </ProductConsumer>
              </ControlProvider>
            </ClassificationProvider>
          </ManufacturerProvider>
        </CategoryProvider>
      </ProductProvider>
    )
  }
}

export default UpdateProductView
