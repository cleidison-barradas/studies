import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Product from '../../interfaces/product'
import { createProduct, getProduct, updateProduct, deleteProduct, getProductDetail } from '../../services/api'
import { GetProductRequest, PostProductRequest } from '../../services/api/interfaces/ApiRequest'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface ProductContextState extends BaseContextState {
    products: Product[]
    product: Product | null
}

interface ProductContextData extends ProductContextState {
    getProducts: (data: GetProductRequest) => Promise<void>
    createProduct: (data: PostProductRequest) => Promise<void>
    updateProduct: (data: PostProductRequest) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    getProductDetail: (id: string) => Promise<void>
}

const productContext = createContext({} as ProductContextData)
export default productContext

const { Consumer, Provider } = productContext
export const ProductConsumer = Consumer

export class ProductProvider extends BaseContextProvider {
    state: ProductContextState = {
        products: [],
        product: null,
    }

    getProducts = async (data: GetProductRequest) => {
        this.startRequest(BaseApi)
        const response = await getProduct(data)
        this.processResponse(response, ['products'])
    }

    createProduct = async (data: PostProductRequest) => {
        this.startRequest(BaseApi)
        const response = await createProduct(data)
        this.processResponse(response, ['product'])
        if (response.ok) {
            this.showMessage('Produto criado com sucesso', 'success')
        }
    }

    updateProduct = async (data: PostProductRequest) => {
        this.startRequest(BaseApi)
        const response = await updateProduct(data)
        this.processResponse(response, ['product'])
        if (response.ok) {
            this.showMessage('Produto atualizado com sucesso', 'success')
        }
    }

    deleteProduct = async (id: string) => {
        this.startRequest(BaseApi)
        const response = await deleteProduct(id)
        this.processResponse(response, [])
        if (response.ok) {
            this.showMessage('Produto deletado com sucesso', 'success')
        }
    }

    getProductDetail = async (id: string) => {
        this.startRequest(BaseApi)
        const response = await getProductDetail(id)
        this.processResponse(response, ['product'])
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getProducts: this.getProducts,
                    createProduct: this.createProduct,
                    updateProduct: this.updateProduct,
                    deleteProduct: this.deleteProduct,
                    getProductDetail: this.getProductDetail,
                }}
            >
                {children}
            </Provider>
        )
    }
}
