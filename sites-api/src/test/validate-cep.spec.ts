import axios, { AxiosResponse } from 'axios'
import { validateCEP } from '../services/search-cep'

jest.mock('axios')

describe('Validate Cep', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('shoud be able returns zip code data when zip code is 8 digits', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        cep: '12345678',
        logradouro: 'Rua dos Testes',
        bairro: 'Centro',
        cidade: 'Cidade Teste',
        estado: 'TS'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse)

    const result = await validateCEP('12345678')

    expect(result).toEqual(mockResponse.data)

    expect(axios.get).toHaveBeenCalledWith('https://viacep.com.br/ws/12345678/json/')
  })

  it('should be able returns undefined when zip code does not have 8 digits', async () => {
    const result = await validateCEP('1234')

    expect(result).toBeUndefined()

    expect(axios.get).not.toHaveBeenCalled()
  })
})
