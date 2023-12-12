import Client, { Axios, AxiosRequestHeaders } from "axios"
import ifood from "../../../config/ifood"
import { IFoodProducts } from "../../../interfaces/productIfood"

export interface IIFoodResponse {
  idLoja: number
  success: boolean
  error?: any
}

class IfoodPlugin {
  private client: Axios

  constructor() {
    this.init()
  }

  private init() {
    this.client = Client.create({
      baseURL: ifood.baseUrl
    })
  }

  private setAuthHeader(headers: AxiosRequestHeaders) {
    Object.keys(headers).forEach(key => {
      this.client.defaults.headers.common[key] = headers[key]
    })
  }

  /**
   * It sends a list of products to the API
   * @param {IFoodProducts[]} products - An array of products to be sent to the API.
   * @param {string} access_token - The access token you received from the login method.
   * @param [reset=false] - boolean - If true, it will delete all products from the database and insert
   * the new ones.
   * @returns The response of the request.
   */
  public sendProducts(products: IFoodProducts[], access_token: string, reset = false) {
    this.setAuthHeader({ Authorization: `Bearer ${access_token}` })

    return this.client.post<IIFoodResponse[]>('/v1/produtointegracao', products, { params: { reset } })
  }
}

export default new IfoodPlugin()