import Axios, { AxiosInstance } from 'axios'
import melhorEnvioConfig from '../../config/melhorenvio'
import { IRequestCreateCart, IResponseAppSettings, IResponseCreateCart } from '../interfaces/melhorenvio.plugin'

interface MelhorEnvioPluginParams {
  accessToken: string
}

class MelhorEnvioPlugin {
  private accessToken: string
  private client: AxiosInstance

  constructor({ accessToken }: MelhorEnvioPluginParams) {

    if (!accessToken || accessToken.length <= 0) {

      throw new Error('missing_authorization')
    }

    this.client = Axios.create({
      baseURL: melhorEnvioConfig.baseURL
    })

    this.accessToken = accessToken
  }

  public async getAppSettings() {
    try {

      const response = await this.client.get<IResponseAppSettings>('api/v2/me/shipment/app-settings',
        { headers: { Authorization: `Bearer ${this.accessToken}` } })

      return response.data

    } catch (error) {
      console.log(error)
      throw new Error('error_on_get_app_settings')

    }
  }

  public async addToCart({ to, from, agency, service, options, volumes, products }: IRequestCreateCart) {
    try {

      const response = await this.client.post<IResponseCreateCart>('api/v2/me/cart', {
        to,
        from,
        agency,
        options,
        volumes,
        products,
        service,
      }, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })

      return response.data

    } catch ({ response: res }) {
      console.log(res.data)

      throw new Error('failure_add_cart_best_shipping')
    }
  }
}

export default MelhorEnvioPlugin
