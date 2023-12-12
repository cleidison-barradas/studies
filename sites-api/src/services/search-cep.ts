/* eslint-disable no-useless-catch */
import { ApiResponse, create } from 'apisauce'
import axios from 'axios'
const { BRASIL_API_CEP_URL } = process.env

const BaseApi = create({
  baseURL: BRASIL_API_CEP_URL,
})

interface Errors {
  name: string,
  message: string,
  service: 'correios' | 'viacep' | 'widenet'
}

interface RequestCEPDTO {
  cep: number
  state: string
  city: string
  neighborhood: string
  street: string
  service: string,
  errors?: Errors[]
}

export async function GetAddressByCEP(cep: RequestCEPDTO['cep']): Promise<ApiResponse<RequestCEPDTO>> {
  try {
    const response = await BaseApi.get(`/v2/${cep}`) as ApiResponse<RequestCEPDTO>

    return response

  } catch (error) {
    console.log(error)
    return error
  }
}

export async function GetAddressInfo(cep: number) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    return response.data
  } catch (error) {
    throw error
  }
}

export async function validateCEP(cep: string) {
  try {
    if (cep.length === 8) {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

      return response.data
    }

  } catch (error) {
    throw error
  }
}
