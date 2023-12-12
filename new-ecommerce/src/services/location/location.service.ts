import cogoToast from 'cogo-toast'
import { siteApi } from "../../config/api"
import { GetStoresByCEP } from "./response.interface"

export async function getStoresByCEP(cep: string) {
  try {
    const response = await siteApi.get<GetStoresByCEP>(`/v2/location/${cep}`)

    if (response.status === 500) {
      throw new Error()
    }

    return response.data
  } catch (error) {
    cogoToast.error('O CEP informado não foi encontrado.', {
      position: 'top-right',
    })
    console.error()
  }

}
