import React, { createContext } from "react"
import useSwr from "swr"
import Region from "../interfaces/regions"
import { getRegions } from "../services/delivery/delivery.service"

interface IFetchDelivery {
  data: Region[]
  error: any
}

interface DeliveryContextData {
  useFetchDelivery: (shouldFetch: boolean, neighborhood?: string) => IFetchDelivery
}

const DeliveryContext = createContext({} as DeliveryContextData)
const { Provider } = DeliveryContext

export const DeliveryProvider: React.FC = ({ children }) => {

  function useFetchDelivery(shouldFetch: boolean, neighborhood?: string) {

    const { data = [], error } = useSwr(shouldFetch ? neighborhood || 'regions' : null, async _neighborhood => {
      const response = await getRegions(neighborhood)

      return response?.regions
    })

    return { data, error }
  }

  return (
    <Provider
      value={{
        useFetchDelivery
      }}
    >{children}
    </Provider>
  )
}

export default DeliveryContext
