import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import { getClassifications } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import Classification from '../../interfaces/classification'
interface ClassificationContextState extends BaseContextState {
  classifications: Classification[],
}

interface ClassificationContextData extends ClassificationContextState {
  requestGetClassifications: (...args: any) => Promise<void>
}

const ClassificationContext = createContext({} as ClassificationContextData)
export default ClassificationContext

const { Consumer, Provider } = ClassificationContext
export const ClassificationConsumer = Consumer

export class ClassificationProvider extends BaseContextProvider {
  state: ClassificationContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    classifications: []
  }

  requestGetClassifications = async (id?: any) => {
    this.startRequest(BaseApi)

    const response = await getClassifications(id)
    this.processResponse(response, ['classifications'])

  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestGetClassifications: this.requestGetClassifications
        }}
      >
        {children}
      </Provider>
    )
  }
}