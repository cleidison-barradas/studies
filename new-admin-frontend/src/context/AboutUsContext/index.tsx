import React, { createContext } from 'react'
import { BaseContextState, BaseContextProvider } from '../BaseContext'
import { getAboutUs, addAboutUs, alterAboutUs, deleteAboutUs } from '../../services/api'

import { BaseApi } from '../../config'
import AboutUs from "../../interfaces/aboutus"

interface AboutUsContextState extends BaseContextState {
  aboutUs: AboutUs[],
  deletedId: string,
  fetching: boolean,
}

interface AboutUsContextData extends AboutUsContextState {
  requestgetAboutUs: () => void,
  requestaddAboutUs: (...args: any) => void,
  requestalterAboutUs: (...args: any) => void,
  requestdeleteAboutUs: (...args: any) => void,
}

// Create context
const context = createContext({} as AboutUsContextData)

const { Provider, Consumer } = context
// Export consumer
export const AboutUsConsumer = Consumer

export class AboutUsProvider extends BaseContextProvider {
  state: AboutUsContextState = {
    aboutUs: [],
    deletedId: '',
    fetching: false,
  }
  componentDidMount() {
    this.startRequest(BaseApi)
  }

  requestgetAboutUs = async (id?: string, page?: any, limit?: any) => {
    this.startRequest(BaseApi)

    const response = await getAboutUs(id, page, limit)

    this.processResponse(response, ['aboutUs'])
  }

  requestaddAboutUs = async (data: AboutUs) => {
    this.startRequest(BaseApi)

    const response = await addAboutUs(data)

    setTimeout(() => {
      this.processResponse(response, ['aboutUs'])
    }, 1500)
    await this.requestgetAboutUs()
  }

  requestalterAboutUs = async (id: string, data: any) => {
    this.startRequest(BaseApi)

    const response = await alterAboutUs(id, data)

    this.processResponse(response, ['aboutUs'])
    const { ok } = response

    if (ok) {

      return response.data
    }
  }

    requestdeleteAboutUs = async (id: string) => {
    this.startRequest(BaseApi)

    const response = await deleteAboutUs(id)

    this.processResponse(response, ['deletedId'])

  }

  render() {
    const { children } = this.props
    const { deletedId, aboutUs, fetching } = this.state
    return (
      <Provider
        value={{
          aboutUs,
          deletedId,
          fetching,
          requestgetAboutUs: this.requestgetAboutUs,
          requestaddAboutUs: this.requestaddAboutUs,
          requestalterAboutUs: this.requestalterAboutUs,
          requestdeleteAboutUs: this.requestdeleteAboutUs,
        }}
      >
        {children}
      </Provider>
    )
  }
}

