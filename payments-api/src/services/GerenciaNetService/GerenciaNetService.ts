import { colors, logger } from '@mypharma/api-core'
import { Agent } from 'https'
import { ICredentials, IGeneratePixBillingRequest, IOAuthResponse, IRequestPixCreateBillingPayload } from './interfaces'
import { CreatePixBilling, GetAgent, GetPixQRCode, OAuth } from './requests'

export default class GerenciaNet {
  certificateKey: string
  client_id: string
  client_secret: string
  pix_key: string
  partner_token: string

  access_token: string
  httpsAgent: Agent

  constructor(props: ICredentials) {
    const { certificateKey, client_id, client_secret, pix_key, partner_token } = props
    this.certificateKey = certificateKey
    this.client_id = client_id
    this.client_secret = client_secret
    this.pix_key = pix_key
    this.partner_token = partner_token
  }

  async Auth(): Promise<IOAuthResponse['access_token']> {
    const { certificateKey, client_id, client_secret, partner_token } = this

    try {
      const credentials = { client_id, client_secret, partner_token }
      const httpsAgent = await GetAgent(certificateKey)
      this.httpsAgent = httpsAgent

      const { access_token } = await OAuth({ credentials, httpsAgent }).then((res) => res.data)

      this.access_token = access_token

      return access_token
    } catch (error) {
      console.log(error)
      logger(error, colors.FgRed)
      throw error
    }
  }

  async GeneratePixBilling(payload: IGeneratePixBillingRequest) {
    await this.Auth()
    const { cpf, nome, valor, pedido_id } = payload
    const { pix_key, access_token, httpsAgent } = this

    const data: IRequestPixCreateBillingPayload = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf,
        nome,
      },
      valor: {
        original: valor,
      },
      chave: pix_key,
      infoAdicionais: [
        {
          nome: 'N* Pedido',
          valor: `#${pedido_id}`,
        },
      ],
    }

    return await CreatePixBilling({ data: JSON.stringify(data), access_token, httpsAgent }).then((res) => res.data)
  }

  async GenerateQRCode(loc_id: string) {
    const { access_token, httpsAgent } = this
    return await GetPixQRCode({ access_token, httpsAgent, loc_id }).then((res) => res.data)
  }
}
