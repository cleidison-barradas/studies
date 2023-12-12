import { withStyles } from '@material-ui/core'
import { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import ProductPaper from '../../components/Papers/ProductPaper'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewProduct extends Component<Props> {
    render() {
        const { history } = this.props
        return (
            <CategoryProvider>
                <ProductProvider>
                    <CategoryConsumer>
                        {({ categories, getCategory }) => (
                            <ProductConsumer>
                                {({
                                    product,
                                    getProducts,
                                    fetching,
                                    createProduct,
                                    updateProduct,
                                    getProductDetail,
                                }) => (
                                    <ProductPaper
                                        product={product}
                                        getProductDetail={getProductDetail}
                                        updateProduct={updateProduct}
                                        history={history}
                                        getProduct={getProducts}
                                        createProduct={createProduct}
                                        categories={categories}
                                        getCategory={getCategory}
                                        manufacturers={[]}
                                        controls={[]}
                                        classifications={[]}
                                        getClassification={() => ''}
                                        getManufacturer={() => ''}
                                        getControl={() => ''}
                                        save={() => {
                                            return new Promise((resolve, reject) => {
                                                resolve()
                                            })
                                        }}
                                        fetching={fetching}
                                    />
                                )}
                            </ProductConsumer>
                        )}
                    </CategoryConsumer>
                </ProductProvider>
            </CategoryProvider>
        )
    }
}

export default withStyles(styles)(NewProduct)
