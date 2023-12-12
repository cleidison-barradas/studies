import axios, { AxiosInstance } from 'axios'
import { GenericObject } from '@mypharma/api-core'

import ifoodConfig from '../../../config/ifood'

interface IAuthIfood {
  expires_in: string
  token_type: string
  access_token: string
  error?: string
}
interface IfoodPluginProps {
  settings: GenericObject
}

class IfoodPlugin {
  private client_id: string
  private client_secret: string
  private client_store_id: number
  private client: AxiosInstance
  private grant_type: 'client_credentials'

  constructor({ settings }: IfoodPluginProps) {
    const client_id = String(settings['config_ifood_client_id']).replace(/\s+/g, '')
    const client_secret = String(settings['config_ifood_client_secret']).replace(/\s+/g, '')

    const client_store_id = Number(String(settings['config_ifood_store_id']).replace(/\s+/g, ''))

    if (client_id.length <= 0 || client_secret.length <= 0 || !client_store_id) {

      throw new Error('missing_ifood_secrets')
    }

    this.client_id = client_id
    this.client_secret = client_secret
    this.grant_type = 'client_credentials'
    this.client_store_id = client_store_id

    this.init()
  }

  private init() {
    this.client = axios.create({
      baseURL: ifoodConfig.baseUrl
    })
  }

  public async auth() {
    try {

      const response = await this.client.post<IAuthIfood>('/oauth/token', {
        client_id: this.client_id,
        grant_type: this.grant_type,
        client_secret: this.client_secret
      })

      if (response.data.error) {

        throw new Error('ifood_auth_error')
      }

      const { access_token } = response.data

      return access_token

    } catch (error) {
      console.log(error)
      throw new Error('ifood_auth_error')
    }
  }

  public getCredentials() {

    const client_id = this.client_id
    const client_secret = this.client_secret
    const client_store_id = this.client_store_id

    return {
      client_id,
      client_secret,
      client_store_id
    }
  }
}

export default IfoodPlugin