import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Control from '../../interfaces/control'
import { getControl } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface ControlContextState extends BaseContextState {
  controls: Control[]
}

interface ControlContextData extends ControlContextState {
  getControls: () => void
}

const ControlContext = createContext({} as ControlContextData)
export default ControlContext

const { Consumer, Provider } = ControlContext
export const ControlConsumer = Consumer

export class ControlProvider extends BaseContextProvider {
  state: ControlContextState = {
    controls: [],
  }

  getControls = async () => {
    this.startRequest(BaseApi)
    const response = await getControl()

    this.processResponse(response, ['controls'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          getControls: this.getControls,
        }}
      >
        {children}
      </Provider>
    )
  }
}
