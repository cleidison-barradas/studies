import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import {
  getDeliverySchedule,
  addDeliverySchedule,
  deleteDeliverySchedule,
  addAverageDeliveryTime,
  getAverageDeliveryTime,
} from '../../services/api'
import DeliverySchedule from '../../interfaces/deliverySchedule'
import { BaseApi } from '../../config'

interface DeliveryScheduleContextState extends BaseContextState {
  deletedId?: string | null
  fetching: boolean
}

export type ScheduleType = {
  schedule: DeliverySchedule[]
  averageDeliveryTime?: number | null
}

export type ResponseUpdateAverageDeliveryTime = {
  config_delivery_schedule: { average_delivery_time: number }
}

interface DeliveryScheduleContextData extends DeliveryScheduleContextState {
  requestGetSchedule: () => Promise<ScheduleType>
  requestAddSchedule: (...args: any) => Promise<ScheduleType | null>
  requestDeleteSchedule: (...args: any) => Promise<any>
}

// Create context
const context = createContext({} as DeliveryScheduleContextData)

const { Provider, Consumer } = context
// Export consumer
export const DeliveryScheduleConsumer = Consumer

export class DeliveryScheduleProvider extends BaseContextProvider {
  state: DeliveryScheduleContextState = {
    deletedId: null,
    fetching: false,
  }

  constructor(props: any) {
    super(props)
    this.state = {
      deletedId: null,
      fetching: false,
    }
  }

  async componentDidMount() {
    this.startRequest(BaseApi)
  }

  requesetGetAverageTime = async () => {
    const response: any = await getAverageDeliveryTime()
    const { data, ok } = response

    return ok ? data.config_delivery_schedule?.average_delivery_time : null
  }

  requestGetSchedule = async (): Promise<ScheduleType> => {
    this.startRequest(BaseApi)
    const response = await getDeliverySchedule()
    const averageDeliveryTime = await this.requesetGetAverageTime()

    const { data, ok } = response

    this.processResponse(response, ['schedules'])

    if (ok) {
      return { schedule: data.schedules, averageDeliveryTime }
    }

    return {
      schedule: [],
    }
  }

  requestAddAverageTime = async (data: any) => {
    const { averageDeliveryTime } = data

    if (averageDeliveryTime) {
      const payload = {
        averageDeliveryTime,
      }

      const response = await addAverageDeliveryTime(payload)
      const { ok } = response

      const {
        config_delivery_schedule: { average_delivery_time },
      } = response.data as ResponseUpdateAverageDeliveryTime

      if (!average_delivery_time) {
        this.showMessage('Falha ao salvar tempo médio de entrega', 'error')
      }

      return ok ? average_delivery_time : null
    }

    return
  }

  requestAddSchedule = async (data: any): Promise<ScheduleType | null> => {
    this.startRequest(BaseApi)

    const averageDeliveryTime = await this.requestAddAverageTime(data)

    const scheduleResponse = await addDeliverySchedule(data)
    const { ok } = scheduleResponse

    if (!averageDeliveryTime)
      setTimeout(() => {
        this.processResponse(scheduleResponse, ['schedule'])
      }, 1000)

    if (ok) {
      this.showMessage('Registros salvos com sucesso', 'success')

      return { schedule: scheduleResponse.data.schedule, averageDeliveryTime }
    }

    return null
  }

  requestDeleteSchedule = async (id: any) => {
    this.startRequest(BaseApi)
    const response = await deleteDeliverySchedule(id)
    const { data, ok } = response

    setTimeout(() => {
      this.processResponse(response, ['deletedId'])
    }, 1000)

    if (ok) {
      return data
    }

    return null
  }


  render() {
    const { children } = this.props
    const { deletedId, fetching, error } = this.state

    return (
      <Provider
        value={{
          error,
          deletedId,
          fetching,
          requestGetSchedule: this.requestGetSchedule,
          requestAddSchedule: this.requestAddSchedule,
          requestDeleteSchedule: this.requestDeleteSchedule,
        }}
      >
        {children}
      </Provider>
    )
  }
}

