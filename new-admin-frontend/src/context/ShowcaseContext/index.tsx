import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import {
  addProductsToShowcase,
  deleteShowcase,
  getShowcases,
  postShowcase,
  putShowcase,
  updateShowcases,
} from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import Showcase from '../../interfaces/showcase'
import SnackbarContext from '../SnackbarContext'
import Product from '../../interfaces/product'

interface ShowcaseContextState extends BaseContextState {
  showcases: Showcase[]
  showcase: Showcase | undefined
}

interface ShowcaseContextData extends ShowcaseContextState {
  getShowcases: (data?: any, id?: Showcase['_id']) => Promise<void>
  postShowcase: (data: Partial<Showcase>) => Promise<void>
  deleteShowcase: (_id: Showcase['_id']) => Promise<void>
  putShowcase: (showcase: Showcase) => Promise<void>
  updateShowcases: (showcases: Showcase[]) => Promise<void>
  addProducts: (products: Product['_id'][]) => Promise<void>
}

const showcaseContext = createContext({} as ShowcaseContextData)
export default showcaseContext

const { Consumer, Provider } = showcaseContext
export const ShowcaseConsumer = Consumer

export class ShowcaseProvider extends BaseContextProvider {
  static contextType = SnackbarContext
  context!: React.ContextType<typeof SnackbarContext>

  state: ShowcaseContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    showcases: [],
    showcase: undefined,
  }

  getShowcases = async (data?: any, id?: Showcase['_id']) => {
    this.startRequest(BaseApi)
    const response = await getShowcases(data, id)
    this.processResponse(response, ['showcases', 'showcase'])
  }

  postShowcase = async (data: Partial<Showcase>) => {
    this.startRequest(BaseApi)
    const response = await postShowcase(data)
    this.processResponse(response, ['showcase'])
  }

  updateShowcases = async (data: Showcase[]) => {
    this.startRequest(BaseApi)
    const response = await updateShowcases(data)
    this.processResponse(response as any, ['showcases'])
    if (response.ok) {
      this.showMessage('Vitrines salvas com sucesso!', 'success')
    }
  }

  deleteShowcase = async (_id: Showcase['_id']) => {
    this.startRequest(BaseApi)
    const response = await deleteShowcase(_id)
    this.processResponse(response)
  }

  putShowcase = async (showcase: Showcase) => {
    this.startRequest(BaseApi)
    const response = await putShowcase(showcase)
    this.processResponse(response, ['showcase'])
    if (response.ok) {
      const { openSnackbar } = this.context
      openSnackbar('Vitrine salva com sucesso', 'success')
    }
  }

  addProducts = async (products: Product['_id'][]) => {
    this.startRequest(BaseApi)
    const response = await addProductsToShowcase(products)
    this.processResponse(response, ['showcase'])
    if (response.ok) {
      const { openSnackbar } = this.context
      openSnackbar('Produtos adicionados a vitrine', 'success')
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getShowcases: this.getShowcases,
          postShowcase: this.postShowcase,
          deleteShowcase: this.deleteShowcase,
          putShowcase: this.putShowcase,
          addProducts: this.addProducts,
          updateShowcases: this.updateShowcases,
        }}
      >
        {children}
      </Provider>
    )
  }
}
