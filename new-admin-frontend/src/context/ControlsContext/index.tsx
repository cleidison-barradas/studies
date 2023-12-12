import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { getProdcutControls } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import Control from '../../interfaces/control'

interface ProductControlState extends BaseContextState {
  productControls: Control[],
}

interface ProductControlContextData extends ProductControlState {
  requestGetProductControls: (...args: any) => void
}

const ProductControlContext = createContext({} as ProductControlContextData)
export default ProductControlContext

const { Consumer, Provider } = ProductControlContext
export const ProductControlConsumer = Consumer

export class ProductControlProvider extends BaseContextProvider {
  state: ProductControlState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    productControls: []
  }

  requestGetProductControls = async (data?: any) => {
    this.startRequest(BaseApi)

    const response = await getProdcutControls(data)
    this.processResponse(response, ['productControls'])

  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestGetProductControls: this.requestGetProductControls
        }}
      >
        {children}
      </Provider>
    )
  }
}