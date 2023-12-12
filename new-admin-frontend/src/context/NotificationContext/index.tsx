import { createContext } from 'react'
import { BaseApi, workerFaturAgilApi } from '../../config'
import { getAdminNotification } from '../../services/api'
import { RequestGetAdminNotification } from '../../services/api/interfaces/ApiRequest'
import { getNotification } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import StoreContext from '../StoreContext'
import Notification from '../../interfaces/notification'
export const NOTIFICATION_KEY = '@myp-admin/notification'


export interface FaturAgil {
  customerId: number
  numberInvoice: number
  dueDate: string
}

interface NotificationContextState extends BaseContextState {
  notification?: Notification | undefined
}

interface NotificationContextData extends NotificationContextState {
  getNotification: (storeId: string) => Promise<void>
  getAdminNotification: (data?: RequestGetAdminNotification) => Promise<void>
}

const NotificationContext = createContext({} as NotificationContextData)
const { Provider, Consumer } = NotificationContext
export default NotificationContext
export const NotificationConsumer = Consumer

export class NotificationProvider extends BaseContextProvider {
  static contextType = StoreContext as any

  state: NotificationContextState = {
    notification: undefined,
    pagination: null,
  }

  getNotification = async (storeId: string) => {
    try {
      this.startRequest(workerFaturAgilApi)

      const response = await getNotification(storeId)
      if (response.ok) {
        this.setState({
          notification: response.data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  getAdminNotification = async (data?: RequestGetAdminNotification) => {
    this.startRequest(BaseApi)

    const response = await getAdminNotification(data)
    this.processResponse(response, ['notification'])
  }

  render() {
    const { children } = this.props

    return (
    <Provider
      value={{
        ...this.state,
        getNotification: this.getNotification,
        getAdminNotification: this.getAdminNotification,
      }}
      >
        {children}
      </Provider>
    )
  }
}
