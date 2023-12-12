import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import RouteLink from '../../interfaces/routeLink'

import { getRouteLinks } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface RouteLinkContextState extends BaseContextState {
  links: RouteLink[]
}

interface RouteLinkContextData extends RouteLinkContextState {
  requestGetRouteLinks: (...args: any) => void
}

const RouteLinkContext = createContext({} as RouteLinkContextData)
export default RouteLinkContext

const { Consumer, Provider } = RouteLinkContext
export const RouteLinkConsumer = Consumer

export class RouteLinkProvider extends BaseContextProvider {
  state: RouteLinkContextState = {
    links: [],
  }

  requestGetRouteLinks = async () => {
    this.startRequest(BaseApi)
    const response = await getRouteLinks()

    this.processResponse(response, ['links'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          requestGetRouteLinks: this.requestGetRouteLinks,
        }}
      >
        {children}
      </Provider>
    )
  }
}