import axios from 'axios'
import { IShipping, ShippingProduct, ShippingService } from '../ports/ShippingService'

const { SHIPPING_API_URL } = process.env

export class ApiShippingService implements ShippingService {
  api = axios.create({ baseURL: SHIPPING_API_URL })

  async getShippingOptions(postcode: string, products: ShippingProduct[], sender: 'courier' | 'bestshipping', authToken: string) {
    const response = await this.api.post(
      '/v1/shipping',
      { zipcode: postcode, products, sender },
      {
        headers: {
          authorization: authToken,
        },
      }
    )

    if (!response.data.shipping) throw new Error('error fetching shipping options')

    return response.data.shipping as IShipping[]
  }
}
