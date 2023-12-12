import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Category from '../../interfaces/category'
import { getCategorys, addCategory, alterCategory, deleteManyCategory, updateManyCategory } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { loadStorage } from '../../services/storage'
import STORAGE_KEYS from '../../services/storageKeys'
import { IStorageAuth } from '../../interfaces/storageAuth'
import Store from '../../interfaces/store'

interface CategoryContextState extends BaseContextState {
  categorys: Category[]
  store: Store | null
  category: Category | null
}

interface CategoryContextData extends CategoryContextState {
  getCategorys: (...args: any) => Promise<void>
  getCategoryDetail: (...args: any) => void
  requestAddCategory: (...args: any) => void
  requestAlterCategory: (...args: any) => void
  requestDeleteCategory: (...args: any) => void
  requestUpdateManyCategory: (...args: any) => void
  requestDeleteManyCategory: (...args: any) => void
}

const categoryContext = createContext({} as CategoryContextData)
export default categoryContext

const { Consumer, Provider } = categoryContext
export const CategoryConsumer = Consumer

export class CategoryProvider extends BaseContextProvider {
  state: CategoryContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    categorys: [],
    category: null,
    store: null,
  }

  componentDidMount() {
    this.startRequest(BaseApi)
    const auth = loadStorage<IStorageAuth>(STORAGE_KEYS.AUTH_KEY)

    if (auth) {
      const { store } = auth

      this.setState((state: any) => ({
        ...state,
        store
      }))
    }
  }

  getCategorys = async (data?: any, id?: any) => {
    this.startRequest(BaseApi)

    const response = await getCategorys(data, id)
    this.processResponse(response, ['categorys'])
  }

  getCategoryDetail = async (id?: any) => {
    this.startRequest(BaseApi)

    const response = await getCategorys(undefined, id)
    this.processResponse(response, ['category'])
  }

  requestAddCategory = async (data: any) => {
    this.startRequest(BaseApi)

    const response = await addCategory(data)
    this.processResponse(response, ['category'])
  }

  requestAlterCategory = async (id?: string, data?: any) => {
    this.startRequest(BaseApi)

    const response = await alterCategory(id, data)
    this.processResponse(response, ['category'])
  }

  requestDeleteCategory = async (data: any) => {
    // this.startRequest(BaseApi)

    // const response = await deleteCategory(data)
    // setTimeout(() => {
    //   this.processResponse(response, ['deletedId'])
    // }, 1000)
  }

  requestUpdateManyCategory = async ({ ids, status }: any) => {
    this.startRequest(BaseApi)
    const response = await updateManyCategory({ ids, status })
    this.processResponse(response, ['categories'])
  }

  requestDeleteManyCategory = async ({ ids }: any) => {
    this.startRequest(BaseApi)
    const response = await deleteManyCategory({ ids })
    this.processResponse(response, ['deletedId'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getCategorys: this.getCategorys,
          getCategoryDetail: this.getCategoryDetail,
          requestAddCategory: this.requestAddCategory,
          requestAlterCategory: this.requestAlterCategory,
          requestDeleteCategory: this.requestDeleteCategory,
          requestUpdateManyCategory: this.requestUpdateManyCategory,
          requestDeleteManyCategory: this.requestDeleteManyCategory
        }}
      >
        {children}
      </Provider>
    )
  }
}
