import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Classification from '../../interfaces/classification'
import { getClassification } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ClassificationContextState extends BaseContextState {
  classifications: Classification[]
}

interface ClassificationContextData extends ClassificationContextState {
  getClassifications: () => void
}

const ClassificationContext = createContext({} as ClassificationContextData)
export default ClassificationContext

const { Consumer, Provider } = ClassificationContext
export const ClassificationConsumer = Consumer

export class ClassificationProvider extends BaseContextProvider {
  state: ClassificationContextState = {
    classifications: [],
  }

  getClassifications = async () => {
    this.startRequest(BaseApi)
    const response = await getClassification()

    this.processResponse(response, ['classifications'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getClassifications: this.getClassifications,
        }}
      >
        {children}
      </Provider>
    )
  }
}
