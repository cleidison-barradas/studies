import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import ProductPaper from '../../components/Papers/ProductPaper'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { ManufacturerConsumer, ManufacturerProvider } from '../../context/ManufacturerContext'
import { ProductProvider, ProductConsumer } from '../../context/ProductContext'
import styles from './styles'

interface Params {
    _id: string
}

interface Props extends RouteComponentProps<Params> {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Product extends Component<Props> {
    render() {
        const {
            match: {
                params: { _id },
            },
            history,
        } = this.props
        return (
            <ManufacturerProvider>
                <CategoryProvider>
                    <ProductProvider>
                        <CategoryConsumer>
                            {({ categories, getCategory }) => (
                                <ProductConsumer>
                                    {({ product, getProducts, createProduct, updateProduct, getProductDetail }) => (
                                        <ManufacturerConsumer>
                                            {({ manufacturers, getManufacturer }) => (
                                                <ProductPaper
                                                    product={product}
                                                    getProductDetail={getProductDetail}
                                                    history={history}
                                                    updateProduct={updateProduct}
                                                    createProduct={createProduct}
                                                    categories={categories}
                                                    getCategory={getCategory}
                                                    manufacturers={manufacturers}
                                                    _id={_id}
                                                    getProduct={getProducts}
                                                    controls={[]}
                                                    classifications={[]}
                                                    getClassification={() => ''}
                                                    getManufacturer={getManufacturer}
                                                    getControl={() => ''}
                                                    save={() => {
                                                        return new Promise((resolve, reject) => {
                                                            resolve()
                                                        })
                                                    }}
                                                />
                                            )}
                                        </ManufacturerConsumer>
                                    )}
                                </ProductConsumer>
                            )}
                        </CategoryConsumer>
                    </ProductProvider>
                </CategoryProvider>
            </ManufacturerProvider>
        )
    }
}

export default withStyles(styles)(Product)
