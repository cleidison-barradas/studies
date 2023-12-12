import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios'
import ifoodConfig from '../../../config/ifood'
import { IIFoodOrder, IIFoodOrderDetail } from '../../../interfaces/ifood.interface'

interface IAuthIfood {
  expires_in: string
  token_type: string
  access_token: string
  error?: string
}

interface IVerifyOrder {
  id: number
}

class IfoodPlugin {
  private client: AxiosInstance

  constructor() {
    this.init()
  }

  private init() {
    return this.client = axios.create({
      baseURL: ifoodConfig.baseUrl
    })
  }

  public setAuthToken(opt: AxiosRequestHeaders) {
    Object.keys(opt).forEach(key => {
      this.client.defaults.headers.common[key] = opt[key]
    })
  }

  public auth(client_id: string, client_secret: string, grant_type: string = "client_credentials") {
    return this.client.post<IAuthIfood>('/oauth/token', { client_id, client_secret, grant_type })

  }

  public getOrders(storeId: number) {
    return this.client.get<IIFoodOrder[]>(`/pedido/eventos/${storeId}`)
  }

  public getOrderDetail(codigoDoPedido: string) {
    return this.client.get<IIFoodOrderDetail>(`/pedido/${codigoDoPedido}`)
  }

  public verifyOrder(id: number) {
    const data: IVerifyOrder[] = []

    data.push({ id })

    return this.client.post('/pedido/eventos/verificado', data)
  }
}

export default new IfoodPlugin()