import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Category from '../../interfaces/category'
import { getCategory } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { GetCategoryRequest } from '../../services/api/interfaces/ApiRequest'

export const TENANT_KEY = '@myp-admin/tenant'
export const USER_KEY = '@myp-admin/user'

interface CategoryContextState extends BaseContextState {
    categories: Category[]
    category: Category | null
}

interface CategoryContextData extends CategoryContextState {
    getCategory: (data?: GetCategoryRequest) => Promise<void>
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
        categories: [],
        category: null,
    }

    getCategory = async (data?: any) => {
        this.startRequest(BaseApi)
        const response = await getCategory(data)
        this.processResponse(response, ['categories'])
    }

    render() {
        const { children } = this.props
        return (
            <Provider
                value={{
                    ...this.state,
                    getCategory: this.getCategory,
                }}
            >
                {children}
            </Provider>
        )
    }
}
