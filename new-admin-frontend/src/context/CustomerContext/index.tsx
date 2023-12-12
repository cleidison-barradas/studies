import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Customer from '../../interfaces/customer'
import ProductOrder from '../../interfaces/productOrder'
import { deleteCustomers, getCustomerOrderProducts, getCustomers } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface CustomerContextState extends BaseContextState {
  customers: Customer[],
  customer: Customer | null,
  products: ProductOrder[]
}

interface CustomerContextData extends CustomerContextState {
  getCustomers: (...args: any) => void,
  deleteCustomers: (...args: any) => void,
  getOrderProducts: (...args: any) => void,
}

const customerContext = createContext({} as CustomerContextData)
export default customerContext

const { Consumer, Provider } = customerContext
export const CustomerConsumer = Consumer

export class CustomerProvider extends BaseContextProvider {
  state: CustomerContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    customers: [],
    customer: null,
    products: []
  }

  getCustomers = async (data?: any, id?: any) => {
    this.startRequest(BaseApi)
    const response = await getCustomers(data, id)
    this.processResponse(response, ['customers', 'customer'])
    return response
  }

  getOrderProducts = async (id: any) => {
    this.startRequest(BaseApi)
    const response = await getCustomerOrderProducts(id)
    this.processResponse(response, ['products'])
    return response
  }

  deleteCustomers = async (ids: Customer['_id'] | Customer['_id'][]) => {
    this.startRequest(BaseApi)
    if (typeof ids === 'object') {
      const response = await deleteCustomers({ ids })
      this.processResponse(response)
      return response
    } else {
      const response = await deleteCustomers({}, ids)
      this.processResponse(response)
      return response
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getCustomers: this.getCustomers,
          deleteCustomers: this.deleteCustomers,
          getOrderProducts: this.getOrderProducts
        }}
      >
        {children}
      </Provider>
    )
  }
}