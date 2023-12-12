import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const listOfAllowedEvents: string[] = ['click', 'scroll']

interface WaypointContextData {
  shouldRenderOptionals: boolean
  setShouldRenderOptionals: React.Dispatch<React.SetStateAction<boolean>>
}

export const waypointContext = createContext({} as WaypointContextData)
const { Provider } = waypointContext

export const WaypointProvider: React.FC = ({ children }) => {
  const { pathname } = useLocation()
  const [shouldRenderOptionals, setShouldRenderOptionals] = useState(false)

  const allowRender = useCallback(() => {
    if (!shouldRenderOptionals) {
      setShouldRenderOptionals(true)
      listOfAllowedEvents.map((value) => window.removeEventListener(value, allowRender))
    }
  }, [shouldRenderOptionals, setShouldRenderOptionals])

  useEffect(() => {
    if (pathname !== '/produtos') {
      setShouldRenderOptionals(true)
    }

    listOfAllowedEvents.map((value) => window.addEventListener(value, allowRender))

    return () => {
      listOfAllowedEvents.map((value) => window.removeEventListener(value, allowRender))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Provider value={{ shouldRenderOptionals, setShouldRenderOptionals }}> {children} </Provider>
  )
}
