import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Product from '../../interfaces/product'
import {
  getProducts,
  getProductDetail,
  addProducts,
  alterProducts,
  deleteProducts,
  updateProductStatus,
  updateProductCategory,
  getVirtualProducts,
  alterVirtualProducts,
} from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import Store from '../../interfaces/store'
import { RequestGetProducts, UpdatedProductStatusRequest, UpdateProductCategory } from '../../services/api/interfaces/ApiRequest'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface ProductContextState extends BaseContextState {
  store?: Store
  success: boolean
  products: Product[]
  virtualProducts: Product[]
  virtualProduct: Product | null
  product: Product | null
}

interface ProductContextData extends ProductContextState {
  getProducts: (data?: RequestGetProducts) => Promise<void>
  getVirtualProducts: (data?: RequestGetProducts) => Promise<void>
  requestGetProductDetail: (...args: any) => Promise<void>
  requestAddProduct: (...args: any) => Promise<void>
  requestAlterProduct: (payload: Product | Product[]) => Promise<void>
  requestAlterVirtualProduct: (payload: Product | Product[]) => Promise<void>
  requestDeleteProduct: (...args: any) => Promise<void>
  requestUpdateStatus: (data: UpdatedProductStatusRequest) => Promise<void>
  requestUpdateCategory: (data: UpdateProductCategory) => void
}

const productContext = createContext({} as ProductContextData)
export default productContext

const { Consumer, Provider } = productContext
export const ProductConsumer = Consumer

export class ProductProvider extends BaseContextProvider {
  state: ProductContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    products: [],
    virtualProducts: [],
    product: null,
    virtualProduct: null,
  }

  getProducts = async (data?: RequestGetProducts) => {
    this.startRequest(BaseApi)

    const response = await getProducts(data)
    this.processResponse(response, ['products'])
  }

  getVirtualProducts = async (data?: RequestGetProducts) => {
    this.startRequest(BaseApi)

    const response = await getVirtualProducts(data)
    this.processResponse(response, ['virtualProducts'])
  }

  requestGetProductDetail = async (id?: any) => {
    this.startRequest(BaseApi)

    this.setState((state: any) => ({
      ...state,
      product: null,
    }))

    const response = await getProductDetail(id)
    this.processResponse(response, ['product'])
  }

  requestAlterProduct = async (payload: Product | Product[]) => {
    this.startRequest(BaseApi)
    const response = await alterProducts(payload)
    if (response.ok) {
      this.showMessage('Produto(s) alterado com sucesso', 'success')
    }
    this.processResponse(response, ['product'])
  }

  requestAlterVirtualProduct = async (payload: Product | Product[]) => {
    this.startRequest(BaseApi)
    const response = await alterVirtualProducts(payload)
    if (response.ok) {
      this.showMessage('Produto alterado com sucesso', 'success')
    }
    this.processResponse(response, ['virtualProduct'])
  }

  requestUpdateStatus = async (data: UpdatedProductStatusRequest) => {
    this.startRequest(BaseApi)
    const response = await updateProductStatus(data)
    if (response.ok) {
      this.showMessage('Produto(s) alterado com sucesso', 'success')
    }
    this.processResponse(response, ['product'])
  }

  requestAddProduct = async (data: any) => {
    this.startRequest(BaseApi)

    this.setState((state: any) => ({
      ...state,
      product: null,
    }))

    const response = await addProducts(data)
    if (response.ok) {
      this.showMessage('Produto(s) criado com sucesso', 'success')
    }
    this.processResponse(response, ['product'])
  }
  requestDeleteProduct = async (id: string[]) => {
    this.startRequest(BaseApi)

    const response = await deleteProducts(id)

    this.processResponse(response, ['deletedId'])
  }

  requestUpdateCategory = async (data: UpdateProductCategory) => {
    this.startRequest(BaseApi)
    const response = await updateProductCategory(data)
    if (response.ok) {
      this.showMessage('Produto(s) alterado com sucesso', 'success')
    }
    this.processResponse(response, ['products'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getProducts: this.getProducts,
          getVirtualProducts: this.getVirtualProducts,
          requestGetProductDetail: this.requestGetProductDetail,
          requestAddProduct: this.requestAddProduct,
          requestAlterProduct: this.requestAlterProduct,
          requestAlterVirtualProduct: this.requestAlterVirtualProduct,
          requestDeleteProduct: this.requestDeleteProduct,
          requestUpdateStatus: this.requestUpdateStatus,
          requestUpdateCategory: this.requestUpdateCategory,
        }}
      >
        {children}
      </Provider>
    )
  }
}
