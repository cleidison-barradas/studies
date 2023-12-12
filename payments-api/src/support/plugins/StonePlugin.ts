import Axios, { AxiosInstance } from 'axios'
import stoneConfig from '../../config/stone'
import { RequestCreateStoneOrder, ResponseCreateStoneOrder } from '../interfaces/stone.plugin'

interface Props {
  publicKey: string
  secretKey: string
}

class StonePlugin {
  private public_key: string
  private private_key: string
  private client: AxiosInstance

  constructor({ publicKey, secretKey }: Props) {

    if (!publicKey || !secretKey) {

      throw new Error('stone_auth_failure')
    }

    this.public_key = publicKey
    this.private_key = Buffer.from(secretKey.replace(/\s+/g, '') + ':').toString('base64').replace(/\s+/g, '')

    this.client = Axios.create({
      baseURL: stoneConfig.baseUrl
    })
  }

  public authenticate() {
    this.client.defaults.headers['Authorization'] = `Basic ${this.private_key}`
  }

  public async requestCreateOrder({ order }: RequestCreateStoneOrder) {
    return this.client.post<ResponseCreateStoneOrder>('/orders', order)
  }
}

export default StonePlugin