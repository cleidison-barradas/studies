import axios from 'axios'
import { getStateNameByUF } from '../helpers/ufToStateName'
import { PostcodeService } from '../ports/PostcodeService'

interface ViaCepResponse {
  logradouro: string
  bairro: string
  complemento: string
  cep: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export class ViaCepService implements PostcodeService {
  async getAddressByPostcode(cep: string) {
    const zipcode = cep.replace(/\D+/g, '')

    if (!zipcode || zipcode.length <= 0) {

      throw new Error('zipcode_not_provided')
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    if (response.status === 400) {

      throw new Error('invalid format')
    }

    return this.parseAddress(response.data)
  }

  parseAddress(data: ViaCepResponse) {
    const { bairro, uf, localidade, logradouro } = data
    return {
      state: getStateNameByUF(uf),
      uf: uf,
      city: localidade,
      street: logradouro,
      neighborhood: bairro,
    }
  }
}
