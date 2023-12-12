import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Product from '../../interfaces/product'
import { getProductPromotions, addProductPromotions, deleteProductPromotions } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ProductPromotionContextState extends BaseContextState {
  promotions: Product[]
  promotion?: Product
}

interface ProductPromotionContextData extends ProductPromotionContextState {
  requestGetProductPromotions: (...args: any) =>  Promise<void>
  requestAddProductPromotions: (...args: any) => Promise<void>
  requestDeleteProductPromotions: (...args: any) => void
}

const productPromotionContext = createContext({} as ProductPromotionContextData)
export default productPromotionContext

const { Consumer, Provider } = productPromotionContext
export const ProductPromotionConsumer = Consumer

export class ProductPromotionProvider extends BaseContextProvider {
  state: ProductPromotionContextState = {
    promotions: [],
  }

  requestGetProductPromotions = async (id?: string, data?: any) => {
    this.startRequest(BaseApi)
    const response = await getProductPromotions(id, data)

    this.processResponse(response, ['promotions', 'promotion'])
  }

  requestAddProductPromotions = async (data: any) => {
    this.startRequest(BaseApi)
    const response = await addProductPromotions(data)
    if (response.ok) {
      this.showMessage('Promoção criada com sucesso', 'success')
    }
    this.processResponse(response, ['promotion'])
  }

  requestDeleteProductPromotions = async (id: string) => {
    this.startRequest(BaseApi)
    const response = await deleteProductPromotions(id)
    this.processResponse(response, ['deletedId'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestGetProductPromotions: this.requestGetProductPromotions,
          requestAddProductPromotions: this.requestAddProductPromotions,
          requestDeleteProductPromotions: this.requestDeleteProductPromotions,
        }}
      >
        {children}
      </Provider>
    )
  }
}
